const itemListUL = $("#main #itemList");
let itemSlider = null;
let itemTweener = null;
function loadJson(jsonFile) {
  $.ajax({
    url: jsonFile,
    success: function (res) {
      console.log(res);
      const itemList = res.items;
      let output = "";
      const total = itemList.length;
      $.each(itemList, function (idx, item) {
        output += `
          <li style="${item.bg}" class="swiper-slide">
            <div class="info">
              <h2 class="title" data-splitting>${item.title}</h2>
              <p class="desc" data-splitting>${item.desc}</p>
              <a href="${item.link}" target="${item.target}">MORE</a>
            </div>
            <div class="img">
              <img src="${item.img}">
            </div>
          </li>
        `;
      });
      itemListUL.html(output);
      if (itemSlider !== null) {
        itemSlider.destroy();
      }
      setTimeout(function () {
        gsap.from("#itemList li", {
          opacity: 0,
          y: -300,
          ease: "bounce",
          duration: 2,
          stagger: {
            from: total,
            amount: 2,
          },
          onComplete: function () {
            moveMario("#itemList .swiper-slide-active .img");
          },
        });
      }, 0);
      itemSlider = new Swiper("#main", {
        slidesPerView: "auto",
        loop: true,
        effect: "coverflow",
        centeredSlides: true,
        coverflowEffect: {
          rotate: 0,
          slideShadows: false,
          depth: 1000,
          stretch: 0,
        },
        pagination: {
          el: "#main .pagination",
          clickable: true,
        },
        mousewheel: true,
      });
      // css 속성 margin-left:300  marginLeft:300, transform:translateX(30px) translateY(30px) rotation:30deg
      if (itemTweener !== null) {
        itemTweener.kill();
        itemTweener = null;
      }
    },
  });
}

function moveMario(moveItem) {
  itemTweener = gsap.to(moveItem, {
    x: Math.random() * 300 - 150,
    y: Math.random() * 200 - 100,
    duration: Math.random() + 0.5,
    onComplete: moveMario,
    onCompleteParams: [moveItem],
  });
}
//moveMario();

// 재귀함수.....(recursion)
function factorial(num) {
  if (num < 1) {
    return 1;
  }
  return num * factorial(num - 1);
}
let result = factorial(5);
console.log(result);

loadJson("../data/mario.json");

const gnbList = $("#gnb li");
gnbList.on("click", function (e) {
  e.preventDefault();
  const jsonFile = $(this).data("json");
  if ($(this).hasClass("selected")) return;
  $(this).addClass("selected").siblings("li").removeClass("selected");
  loadJson(jsonFile);
});
