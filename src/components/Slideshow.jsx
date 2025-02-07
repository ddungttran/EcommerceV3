function Slideshow() {
    const slides = [
      { img: "/Mroom.png", alt: "Slide 1" },
      { img: "/pic1.webp", alt: "Slide 2" },
      { img: "/pic2.webp", alt: "Slide 3" },
      { img: "/pic3.webp", alt: "Slide 4" },
    ];
  
    return (
      <section className="slideshow">
        {slides.map((slide, index) => (
          <div className="slideshow-slide" key={index}>
            <div className="slideshow-content">
              <h2>
                <a href="/products" className="slide-link">Shop Here</a>
              </h2>
            </div>
            <img src={slide.img} alt={slide.alt} />
          </div>
        ))}
      </section>
    );
  }
  
  export default Slideshow;
  