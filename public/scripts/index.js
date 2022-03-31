let sliders = document.querySelectorAll(".slide_in");
let faders = document.querySelectorAll("fade_in");

const appearOptions = {
    threshold: 0
    // rootMargin: "0px 0px 0px 0px";
};

const appearOnScroll = new IntersectionObserver(function(elements , appearOnScroll) {
    
    elements.forEach((element) => {
        if(!element.isIntersecting) {
            return;
        }
        else {
            element.target.classList.add("appear");
            appearOnScroll.unobserve(element.target);
        }
    });

} , appearOptions);

faders.forEach((fader) => {
    appearOnScroll.observe(fader)
});

sliders.forEach((slider) => {
    appearOnScroll.observe(slider)
});