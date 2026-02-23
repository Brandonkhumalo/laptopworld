const AnnouncementBar = () => {
  return (
    <div className="gradient-accent overflow-hidden py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, i) => (
          <span key={i} className="mx-8 text-sm font-semibold text-secondary-foreground">
            🔥 FREE Delivery on Orders Over $100 &nbsp;•&nbsp; 
            ✅ Genuine Products Guaranteed &nbsp;•&nbsp; 
            🚚 Same-Day Delivery in Harare &nbsp;•&nbsp; 
            💳 Cash on Delivery Available &nbsp;•&nbsp;
            📞 Support: +263 8677210547 &nbsp;•&nbsp;
            🔥 FREE Delivery on Orders Over $100 &nbsp;•&nbsp; 
            ✅ Genuine Products Guaranteed &nbsp;•&nbsp; 
            🚚 Same-Day Delivery in Harare &nbsp;•&nbsp; 
            💳 Cash on Delivery Available &nbsp;•&nbsp;
            📞 Support: +263 8677210547
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
