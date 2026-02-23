export interface SpecField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: string[];
  placeholder?: string;
}

export interface SpecSection {
  title: string;
  fields: SpecField[];
}

export const specTemplates: Record<string, SpecSection[]> = {
  phone: [
    {
      title: 'Basic Info',
      fields: [
        { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Samsung' },
        { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Galaxy S25 FE' },
        { key: 'release_year', label: 'Release Year', type: 'text', placeholder: '2025' },
        { key: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] },
        { key: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Jet Black' },
        { key: 'storage', label: 'Storage Capacity (GB)', type: 'text', placeholder: '128' },
        { key: 'ram', label: 'RAM (GB)', type: 'text', placeholder: '8' },
        { key: 'sim_type', label: 'SIM Type', type: 'select', options: ['Single', 'Dual'] },
        { key: 'network', label: 'Network', type: 'select', options: ['2G', '3G', '4G', '5G'] },
      ],
    },
    {
      title: 'Display',
      fields: [
        { key: 'screen_size', label: 'Screen Size (inches)', type: 'text', placeholder: '6.7' },
        { key: 'display_type', label: 'Display Type', type: 'text', placeholder: 'Dynamic AMOLED' },
        { key: 'resolution', label: 'Resolution', type: 'text', placeholder: '1080 x 2340' },
        { key: 'refresh_rate', label: 'Refresh Rate (Hz)', type: 'text', placeholder: '120' },
        { key: 'display_protection', label: 'Protection', type: 'text', placeholder: 'Gorilla Glass Victus 2' },
      ],
    },
    {
      title: 'Performance',
      fields: [
        { key: 'processor', label: 'Processor', type: 'text', placeholder: 'Exynos 2400' },
        { key: 'gpu', label: 'GPU', type: 'text', placeholder: 'Xclipse 940' },
        { key: 'os', label: 'Operating System', type: 'text', placeholder: 'Android 15' },
        { key: 'os_version', label: 'OS Version', type: 'text', placeholder: 'One UI 7' },
      ],
    },
    {
      title: 'Camera',
      fields: [
        { key: 'rear_camera', label: 'Rear Camera', type: 'text', placeholder: '50MP + 12MP + 8MP' },
        { key: 'front_camera', label: 'Front Camera', type: 'text', placeholder: '12MP' },
        { key: 'video_recording', label: 'Video Recording', type: 'text', placeholder: '4K @ 60fps' },
        { key: 'camera_features', label: 'Camera Features', type: 'text', placeholder: 'OIS, HDR, Night Mode' },
      ],
    },
    {
      title: 'Battery & Charging',
      fields: [
        { key: 'battery_capacity', label: 'Battery Capacity (mAh)', type: 'text', placeholder: '4900' },
        { key: 'charging_speed', label: 'Charging Speed (W)', type: 'text', placeholder: '25' },
        { key: 'wireless_charging', label: 'Wireless Charging', type: 'select', options: ['Yes', 'No'] },
        { key: 'reverse_charging', label: 'Reverse Charging', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Connectivity',
      fields: [
        { key: 'wifi', label: 'WiFi Version', type: 'text', placeholder: 'WiFi 6E' },
        { key: 'bluetooth', label: 'Bluetooth Version', type: 'text', placeholder: '5.3' },
        { key: 'nfc', label: 'NFC', type: 'select', options: ['Yes', 'No'] },
        { key: 'usb_type', label: 'USB Type', type: 'select', options: ['USB-C', 'Micro USB', 'Lightning'] },
        { key: 'gps', label: 'GPS', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Build',
      fields: [
        { key: 'weight', label: 'Weight', type: 'text', placeholder: '191g' },
        { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: '162.0 x 77.3 x 8.0 mm' },
        { key: 'water_resistance', label: 'Water Resistance', type: 'text', placeholder: 'IP68' },
        { key: 'material', label: 'Material', type: 'text', placeholder: 'Glass / Aluminum' },
      ],
    },
    {
      title: 'Security',
      fields: [
        { key: 'fingerprint', label: 'Fingerprint Sensor', type: 'select', options: ['Under Display', 'Side', 'Rear', 'None'] },
        { key: 'face_unlock', label: 'Face Unlock', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'In the Box',
      fields: [
        { key: 'charger_included', label: 'Charger Included', type: 'select', options: ['Yes', 'No'] },
        { key: 'cable_included', label: 'Cable Included', type: 'select', options: ['Yes', 'No'] },
        { key: 'earphones_included', label: 'Earphones Included', type: 'select', options: ['Yes', 'No'] },
      ],
    },
  ],
  laptop: [
    {
      title: 'Basic Info',
      fields: [
        { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. HP' },
        { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Pavilion 15' },
        { key: 'release_year', label: 'Release Year', type: 'text', placeholder: '2025' },
        { key: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] },
        { key: 'color', label: 'Color', type: 'text', placeholder: 'Silver' },
      ],
    },
    {
      title: 'Performance',
      fields: [
        { key: 'processor', label: 'Processor', type: 'text', placeholder: 'Intel Core i5-12450H' },
        { key: 'processor_gen', label: 'Generation', type: 'text', placeholder: '12th Gen' },
        { key: 'cores_threads', label: 'Cores / Threads', type: 'text', placeholder: '8 / 12' },
        { key: 'base_speed', label: 'Base Speed (GHz)', type: 'text', placeholder: '2.0' },
        { key: 'turbo_speed', label: 'Turbo Speed (GHz)', type: 'text', placeholder: '4.4' },
        { key: 'ram', label: 'RAM (GB)', type: 'text', placeholder: '16' },
        { key: 'ram_type', label: 'RAM Type', type: 'select', options: ['DDR4', 'DDR5', 'LPDDR4X', 'LPDDR5'] },
        { key: 'ram_upgradeable', label: 'RAM Upgradeable', type: 'select', options: ['Yes', 'No'] },
        { key: 'storage_type', label: 'Storage Type', type: 'select', options: ['SSD', 'HDD', 'NVMe SSD', 'eMMC'] },
        { key: 'storage_capacity', label: 'Storage Capacity', type: 'text', placeholder: '512GB' },
        { key: 'expandable_storage', label: 'Expandable Storage', type: 'select', options: ['Yes', 'No'] },
        { key: 'graphics_type', label: 'Graphics', type: 'select', options: ['Integrated', 'Dedicated'] },
        { key: 'gpu_model', label: 'GPU Model', type: 'text', placeholder: 'NVIDIA RTX 3050' },
      ],
    },
    {
      title: 'Display',
      fields: [
        { key: 'screen_size', label: 'Screen Size', type: 'text', placeholder: '15.6"' },
        { key: 'resolution', label: 'Resolution', type: 'text', placeholder: '1920 x 1080 (FHD)' },
        { key: 'panel_type', label: 'Panel Type', type: 'select', options: ['IPS', 'OLED', 'TN', 'VA'] },
        { key: 'refresh_rate', label: 'Refresh Rate (Hz)', type: 'text', placeholder: '144' },
        { key: 'touchscreen', label: 'Touchscreen', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Battery',
      fields: [
        { key: 'battery_life', label: 'Battery Life (Hours)', type: 'text', placeholder: '8' },
        { key: 'battery_capacity', label: 'Battery Capacity (Wh)', type: 'text', placeholder: '52' },
        { key: 'charging_type', label: 'Charging Type', type: 'select', options: ['USB-C', 'Barrel Plug', 'Both'] },
      ],
    },
    {
      title: 'Ports',
      fields: [
        { key: 'usb_ports', label: 'USB Ports', type: 'text', placeholder: '2x USB-A, 1x USB-C' },
        { key: 'hdmi', label: 'HDMI', type: 'select', options: ['Yes', 'No'] },
        { key: 'sd_card', label: 'SD Card Slot', type: 'select', options: ['Yes', 'No'] },
        { key: 'headphone_jack', label: 'Headphone Jack', type: 'select', options: ['Yes', 'No'] },
        { key: 'ethernet', label: 'Ethernet Port', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Connectivity',
      fields: [
        { key: 'wifi', label: 'WiFi Version', type: 'text', placeholder: 'WiFi 6' },
        { key: 'bluetooth', label: 'Bluetooth Version', type: 'text', placeholder: '5.2' },
      ],
    },
    {
      title: 'Build',
      fields: [
        { key: 'weight', label: 'Weight', type: 'text', placeholder: '1.8kg' },
        { key: 'material', label: 'Material', type: 'text', placeholder: 'Aluminum' },
        { key: 'keyboard_backlit', label: 'Keyboard Backlit', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Software',
      fields: [
        { key: 'os', label: 'Operating System', type: 'text', placeholder: 'Windows 11 Home' },
        { key: 'preinstalled_software', label: 'Pre-installed Software', type: 'text', placeholder: 'Microsoft Office Trial' },
      ],
    },
  ],
  smartwatch: [
    {
      title: 'Basic Info',
      fields: [
        { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Samsung' },
        { key: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Galaxy Watch 6' },
        { key: 'compatibility', label: 'Compatibility', type: 'select', options: ['Android', 'iOS', 'Android & iOS'] },
        { key: 'strap_material', label: 'Strap Material', type: 'text', placeholder: 'Silicone' },
        { key: 'strap_size', label: 'Strap Size', type: 'text', placeholder: '20mm' },
      ],
    },
    {
      title: 'Display',
      fields: [
        { key: 'screen_size', label: 'Screen Size', type: 'text', placeholder: '1.4"' },
        { key: 'display_type', label: 'Display Type', type: 'text', placeholder: 'Super AMOLED' },
        { key: 'resolution', label: 'Resolution', type: 'text', placeholder: '450 x 450' },
        { key: 'always_on', label: 'Always-On Display', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Features',
      fields: [
        { key: 'heart_rate', label: 'Heart Rate Monitor', type: 'select', options: ['Yes', 'No'] },
        { key: 'spo2', label: 'SpO2 Monitor', type: 'select', options: ['Yes', 'No'] },
        { key: 'ecg', label: 'ECG', type: 'select', options: ['Yes', 'No'] },
        { key: 'sleep_tracking', label: 'Sleep Tracking', type: 'select', options: ['Yes', 'No'] },
        { key: 'sports_modes', label: 'Sports Modes', type: 'text', placeholder: '90+' },
        { key: 'gps', label: 'GPS Built-in', type: 'select', options: ['Yes', 'No'] },
        { key: 'call_function', label: 'Call Function', type: 'select', options: ['Yes', 'No'] },
        { key: 'bluetooth_calling', label: 'Bluetooth Calling', type: 'select', options: ['Yes', 'No'] },
        { key: 'nfc', label: 'NFC', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Battery',
      fields: [
        { key: 'battery_capacity', label: 'Battery Capacity', type: 'text', placeholder: '300mAh' },
        { key: 'battery_life', label: 'Battery Life (Days)', type: 'text', placeholder: '2-3' },
        { key: 'charging_time', label: 'Charging Time', type: 'text', placeholder: '1.5 hours' },
      ],
    },
    {
      title: 'Water Resistance',
      fields: [
        { key: 'water_resistance', label: 'IP / ATM Rating', type: 'text', placeholder: 'IP68 / 5ATM' },
      ],
    },
  ],
  accessory: [
    {
      title: 'Basic Info',
      fields: [
        { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Anker' },
        { key: 'type', label: 'Accessory Type', type: 'select', options: ['Charger', 'Power Bank', 'Earphones', 'Headphones', 'Case', 'Cable', 'Mouse', 'Keyboard', 'Bag', 'Screen Protector', 'Other'] },
        { key: 'compatibility', label: 'Compatibility', type: 'text', placeholder: 'e.g. iPhone 15, USB-C devices' },
        { key: 'color', label: 'Color', type: 'text', placeholder: 'Black' },
      ],
    },
    {
      title: 'Power Specs',
      fields: [
        { key: 'capacity', label: 'Capacity (mAh)', type: 'text', placeholder: '10000' },
        { key: 'output_power', label: 'Output Power (W)', type: 'text', placeholder: '20' },
        { key: 'fast_charging', label: 'Fast Charging', type: 'select', options: ['Yes', 'No'] },
        { key: 'ports', label: 'Ports', type: 'text', placeholder: '1x USB-C, 1x USB-A' },
      ],
    },
    {
      title: 'Audio Specs',
      fields: [
        { key: 'audio_type', label: 'Type', type: 'select', options: ['Wired', 'Wireless', 'TWS (True Wireless)'] },
        { key: 'noise_cancellation', label: 'Noise Cancellation', type: 'select', options: ['Yes', 'No'] },
        { key: 'battery_life', label: 'Battery Life (Hours)', type: 'text', placeholder: '8' },
        { key: 'bluetooth_version', label: 'Bluetooth Version', type: 'text', placeholder: '5.3' },
        { key: 'microphone', label: 'Microphone', type: 'select', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Connectivity',
      fields: [
        { key: 'connectivity', label: 'Connectivity', type: 'select', options: ['Wired', 'Wireless', 'Bluetooth', 'USB'] },
        { key: 'cable_length', label: 'Cable Length', type: 'text', placeholder: '1.5m' },
      ],
    },
  ],
  other: [
    {
      title: 'General Specifications',
      fields: [
        { key: 'brand', label: 'Brand', type: 'text', placeholder: 'Brand name' },
        { key: 'model', label: 'Model', type: 'text', placeholder: 'Model name' },
        { key: 'color', label: 'Color', type: 'text', placeholder: 'Color' },
        { key: 'material', label: 'Material', type: 'text', placeholder: 'Material' },
        { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'L x W x H' },
        { key: 'weight', label: 'Weight', type: 'text', placeholder: 'Weight' },
      ],
    },
  ],
};

export function getSpecSections(categoryType: string): SpecSection[] {
  return specTemplates[categoryType] || specTemplates.other;
}

export function specsToGrouped(specs: Record<string, string>, categoryType: string): { title: string; items: { label: string; value: string }[] }[] {
  const sections = getSpecSections(categoryType);
  const result: { title: string; items: { label: string; value: string }[] }[] = [];

  for (const section of sections) {
    const items: { label: string; value: string }[] = [];
    for (const field of section.fields) {
      const val = specs[field.key];
      if (val && val.trim()) {
        items.push({ label: field.label, value: val });
      }
    }
    if (items.length > 0) {
      result.push({ title: section.title, items });
    }
  }

  const knownKeys = new Set(sections.flatMap(s => s.fields.map(f => f.key)));
  const extraItems: { label: string; value: string }[] = [];
  for (const [key, value] of Object.entries(specs)) {
    if (!knownKeys.has(key) && value && String(value).trim()) {
      extraItems.push({ label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: String(value) });
    }
  }
  if (extraItems.length > 0) {
    result.push({ title: 'Other', items: extraItems });
  }

  return result;
}
