"""
Image compression pipeline for uploaded product/category images.

Upload → Validate → Resize → Compress → Strip EXIF → Save
Target: each image stays under ~200KB.
"""

import io
import os
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile

# Allowed image formats (MIME subtypes)
ALLOWED_FORMATS = {'jpeg', 'jpg', 'png', 'webp'}
MAX_WIDTH = 1200
JPEG_QUALITY = 80
# If a PNG is larger than this (bytes), convert it to JPEG
PNG_CONVERT_THRESHOLD = 500 * 1024  # 500KB


def compress_image(image_file):
    """
    Compress and optimize an uploaded image file.

    Steps:
    1. Validate format (JPEG/PNG/WebP only)
    2. Resize to max 1200px wide, maintaining aspect ratio
    3. Compress: JPEG at quality 80%, convert large PNGs to JPEG
    4. Strip EXIF metadata for privacy and smaller file size

    Returns:
        InMemoryUploadedFile — the compressed image ready for Django's ImageField
    """
    img = Image.open(image_file)
    original_format = (img.format or '').lower()

    # 1. Validate format
    if original_format not in ALLOWED_FORMATS and original_format != 'mpo':
        # MPO is a multi-picture JPEG variant from some cameras
        ext = os.path.splitext(image_file.name)[1].lower().lstrip('.')
        if ext not in ALLOWED_FORMATS:
            raise ValueError(f"Unsupported image format: {original_format or ext}. Allowed: JPEG, PNG, WebP.")

    # 2. Strip EXIF by copying pixel data to a clean image
    #    This removes all metadata (EXIF, GPS, camera info) for privacy + size
    if img.mode in ('RGBA', 'LA', 'P'):
        # Keep alpha channel for now — we'll handle it during format conversion
        clean = Image.new('RGBA', img.size)
        clean.putdata(list(img.convert('RGBA').getdata()))
    else:
        clean = Image.new('RGB', img.size)
        clean.putdata(list(img.convert('RGB').getdata()))

    # 3. Resize if wider than MAX_WIDTH, maintaining aspect ratio
    if clean.width > MAX_WIDTH:
        ratio = MAX_WIDTH / clean.width
        new_height = int(clean.height * ratio)
        clean = clean.resize((MAX_WIDTH, new_height), Image.LANCZOS)

    # 4. Decide output format and compress
    buffer = io.BytesIO()

    # Determine if we should save as JPEG or keep original format
    is_png = original_format == 'png'
    has_alpha = clean.mode in ('RGBA', 'LA')

    if is_png and not has_alpha:
        # PNG without transparency — check size, convert to JPEG if large
        test_buffer = io.BytesIO()
        clean.save(test_buffer, format='PNG', optimize=True)
        if test_buffer.tell() > PNG_CONVERT_THRESHOLD:
            # Convert to JPEG for better compression
            save_format = 'JPEG'
            ext = '.jpg'
            content_type = 'image/jpeg'
        else:
            save_format = 'PNG'
            ext = '.png'
            content_type = 'image/png'
    elif is_png and has_alpha:
        # PNG with transparency — keep as PNG
        save_format = 'PNG'
        ext = '.png'
        content_type = 'image/png'
    elif original_format == 'webp':
        save_format = 'WEBP'
        ext = '.webp'
        content_type = 'image/webp'
    else:
        # Default to JPEG (covers jpeg, jpg, mpo, and anything else)
        save_format = 'JPEG'
        ext = '.jpg'
        content_type = 'image/jpeg'

    # Convert to RGB if saving as JPEG (JPEG doesn't support alpha)
    if save_format == 'JPEG' and clean.mode != 'RGB':
        clean = clean.convert('RGB')

    # Save with compression
    save_kwargs = {'optimize': True}
    if save_format == 'JPEG':
        save_kwargs['quality'] = JPEG_QUALITY
    elif save_format == 'WEBP':
        save_kwargs['quality'] = JPEG_QUALITY

    clean.save(buffer, format=save_format, **save_kwargs)
    buffer.seek(0)

    # Build the output filename
    name_without_ext = os.path.splitext(image_file.name)[0]
    new_name = f"{name_without_ext}{ext}"

    return InMemoryUploadedFile(
        file=buffer,
        field_name='image',
        name=new_name,
        content_type=content_type,
        size=buffer.getbuffer().nbytes,
        charset=None,
    )
