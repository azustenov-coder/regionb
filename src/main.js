import './style.css';
import { createIcons, icons } from 'lucide';

// Initialize Lucide icons
createIcons({ icons });

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-active');
    });
  }

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav) mainNav.classList.remove('mobile-active');
    });
  });

  // 2. Animated Counter Stats on Scroll
  const statNumbers = document.querySelectorAll('.stat-number');
  let counterAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      if (!targetStr) return;
      const target = parseInt(targetStr, 10);
      const duration = 2000;
      const step = Math.max(1, Math.ceil(target / (duration / 25)));
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.innerText = target.toLocaleString('uz-UZ') + (targetStr.includes('+') ? '+' : (targetStr.includes('m³') ? ' m³' : ''));
          clearInterval(timer);
        } else {
          stat.innerText = current.toLocaleString('uz-UZ') + (targetStr.includes('+') ? '+' : '');
        }
      }, 25);
    });
  };

  const heroStatsGrid = document.querySelector('.hero-stats-grid');
  if (heroStatsGrid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
          animateCounters();
          counterAnimated = true;
        }
      });
    }, { threshold: 0.2 });
    observer.observe(heroStatsGrid);
  }

  // Hero Showcase Photo Slider & Navigation
  const showcaseSlides = document.querySelectorAll('.showcase-slide');
  const showcaseDots = document.querySelectorAll('.showcase-dot');
  const showcasePrevBtn = document.getElementById('showcasePrev');
  const showcaseNextBtn = document.getElementById('showcaseNext');
  let currentShowcaseSlide = 0;
  let showcaseSlideTimer = null;

  const goToShowcaseSlide = (index) => {
    if (!showcaseSlides.length) return;
    currentShowcaseSlide = (index + showcaseSlides.length) % showcaseSlides.length;
    showcaseSlides.forEach((slide, idx) => {
      if (idx === currentShowcaseSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    showcaseDots.forEach((dot, idx) => {
      if (idx === currentShowcaseSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const startShowcaseAutoplay = () => {
    if (showcaseSlideTimer) clearInterval(showcaseSlideTimer);
    showcaseSlideTimer = setInterval(() => {
      goToShowcaseSlide(currentShowcaseSlide + 1);
    }, 4000);
  };

  if (showcaseSlides.length > 0) {
    showcaseDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToShowcaseSlide(idx);
        startShowcaseAutoplay();
      });
    });

    if (showcasePrevBtn) {
      showcasePrevBtn.addEventListener('click', () => {
        goToShowcaseSlide(currentShowcaseSlide - 1);
        startShowcaseAutoplay();
      });
    }

    if (showcaseNextBtn) {
      showcaseNextBtn.addEventListener('click', () => {
        goToShowcaseSlide(currentShowcaseSlide + 1);
        startShowcaseAutoplay();
      });
    }

    startShowcaseAutoplay();
  }

  // 3. Concrete Volume & Price Calculator (Home & Calculator page)
  let selectedStructureType = 'plita';
  let calcWidth = 10;
  let calcLength = 10;
  let calcThickness = 0.2;
  let calcReservePercent = 5;
  let selectedGradePrice = 520000; // default M200 (UZS)
  let selectedGradeName = 'M200 (B15)';

  const structTabs = document.querySelectorAll('.calc-struct-tab');
  const inputWidth = document.getElementById('calcWidth');
  const inputLength = document.getElementById('calcLength');
  const inputThickness = document.getElementById('calcThickness');
  const inputReserve = document.getElementById('calcReserve');
  const selectGrade = document.getElementById('calcGradeSelect');
  
  const calcResultVolume = document.getElementById('calcResultVolume');
  const calcResultReserveVol = document.getElementById('calcResultReserveVol');
  const calcResultWeight = document.getElementById('calcResultWeight');
  const calcResultPrice = document.getElementById('calcResultPrice');

  const updateCalculations = () => {
    if (inputWidth) calcWidth = parseFloat(inputWidth.value) || 0;
    if (inputLength) calcLength = parseFloat(inputLength.value) || 0;
    if (inputThickness) calcThickness = parseFloat(inputThickness.value) || 0;
    if (inputReserve) calcReservePercent = parseFloat(inputReserve.value) || 0;

    let baseVolume = 0;

    if (selectedStructureType === 'plita' || selectedStructureType === 'lenta') {
      baseVolume = calcWidth * calcLength * calcThickness;
    } else if (selectedStructureType === 'ustun') {
      // Width = width, Length = thickness, Thickness = height
      baseVolume = calcWidth * calcLength * calcThickness;
    } else if (selectedStructureType === 'svaya') {
      // Cylinder: radius = width/2, height = thickness
      const r = calcWidth / 2;
      baseVolume = Math.PI * r * r * calcThickness * (calcLength || 1); // calcLength as quantity of piles
    } else {
      baseVolume = calcWidth * calcLength * calcThickness;
    }

    const totalVolumeWithReserve = baseVolume * (1 + calcReservePercent / 100);
    const weightTons = totalVolumeWithReserve * 2.4; // Average concrete density ~2.4 t/m3
    
    if (selectGrade && selectGrade.selectedOptions.length > 0) {
      selectedGradePrice = parseInt(selectGrade.selectedOptions[0].getAttribute('data-price') || '520000', 10);
      selectedGradeName = selectGrade.selectedOptions[0].text;
    }

    const totalPrice = totalVolumeWithReserve * selectedGradePrice;

    if (calcResultVolume) calcResultVolume.innerText = baseVolume.toFixed(2) + ' m³';
    if (calcResultReserveVol) calcResultReserveVol.innerText = totalVolumeWithReserve.toFixed(2) + ' m³';
    if (calcResultWeight) calcResultWeight.innerText = weightTons.toFixed(1) + ' t';
    if (calcResultPrice) calcResultPrice.innerText = Math.round(totalPrice).toLocaleString('uz-UZ') + " so'm";
  };

  structTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      structTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedStructureType = tab.getAttribute('data-struct') || 'plita';
      updateCalculations();
    });
  });

  [inputWidth, inputLength, inputThickness, inputReserve, selectGrade].forEach(elem => {
    if (elem) elem.addEventListener('input', updateCalculations);
  });

  updateCalculations();

  // 4. Interactive Factory Tabs Data
  const factoryData = {
    sergeli: {
      tag: "SERGELI TUMANI SANOAT ZONASI",
      name: "REGION BETON — Sergeli Markaziy Zavodi",
      desc: "Germaniyaning Liebherr avtomatlashtirilgan 2 ta aralashtirish liniyasiga ega bosh zavodimiz. Kunlik 3 200 m³ yuqori sifatli beton aralashmasi quvvati.",
      capacity: "3 200 m³ / kun",
      mixers: "45 ta Avtomikser",
      address: "Toshkent sh., Sergeli t-ni, Sanoat hududi 4-uy",
      mapUrl: "https://maps.google.com/maps?q=Sergeli+Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
    },
    yunusobod: {
      tag: "YUNUSOBOD TUMANI SHIMOLIY ZONA",
      name: "REGION BETON — Yunusobod Zavodi",
      desc: "Toshkentning shimoliy hududi va Yangi Toshkent obyektlariga uzluksiz va eng tez fursatda beton yetkazuvchi filiyallamiz.",
      capacity: "2 800 m³ / kun",
      mixers: "35 ta Avtomikser",
      address: "Toshkent sh., Yunusobod t-ni, Amir Temur ko'chasi sanoat hududi",
      mapUrl: "https://maps.google.com/maps?q=Yunusabad+Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
    },
    yashnobod: {
      tag: "YASHNOBOD TUMANI FARG'ONA YO'LI",
      name: "REGION BETON — Yashnobod Zavodi",
      desc: "Shahar sharqiy qismi va sanoat obyektlari uchun mo'ljallangan zamonaviy beton zavodi. 24/7 to'xtovsiz logistika.",
      capacity: "2 600 m³ / kun",
      mixers: "30 ta Avtomikser",
      address: "Toshkent sh., Yashnobod t-ni, Farg'ona yo'li ko'chasi 15-uy",
      mapUrl: "https://maps.google.com/maps?q=Yashnabad+Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
    },
    bektemir: {
      tag: "BEKTEMIR SANOAT ZONASI",
      name: "REGION BETON — Bektemir Zavodi",
      desc: "Magistral yo'llar va ko'priklar qurilishi uchun mo'ljallangan o'ta mustahkam va sulfatga chidamli beton ishlab chiqaruvchi majmua.",
      capacity: "2 500 m³ / kun",
      mixers: "28 ta Avtomikser",
      address: "Toshkent sh., Bektemir t-ni, Sanoat zonasi",
      mapUrl: "https://maps.google.com/maps?q=Bektemir+Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
    },
    zangiota: {
      tag: "TOSHKENT VILOYATI ZANGIOTA",
      name: "REGION BETON — Zangiota Zavodi",
      desc: "Toshkent viloyati bo'ylab keng ko'lamli turar-joy va tijorat obyektlariga sifatli beton mahsulotlarini yetkazib beradi.",
      capacity: "2 400 m³ / kun",
      mixers: "25 ta Avtomikser",
      address: "Toshkent viloyati, Zangiota tumani",
      mapUrl: "https://maps.google.com/maps?q=Zangiata+Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
    },
    yangiyol: {
      tag: "YANGIYO'L SANOAT PARKI",
      name: "REGION BETON — Yangiyo'l Zavodi",
      desc: "Janubiy yo'nalish va infratuzilma ob'ektlariga xizmat ko'rsatuvchi 6-avtomatlashtirilgan beton zavodimiz.",
      capacity: "2 200 m³ / kun",
      mixers: "20 ta Avtomikser",
      address: "Toshkent viloyati, Yangiyo'l shahri sanoat zonasi",
      mapUrl: "https://maps.google.com/maps?q=Yangiyul+Uzbekistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
    }
  };

  const factoryTabs = document.querySelectorAll('.factory-tab');
  const facTag = document.getElementById('facTag');
  const facName = document.getElementById('facName');
  const facDesc = document.getElementById('facDesc');
  const facCapacity = document.getElementById('facCapacity');
  const facMixers = document.getElementById('facMixers');
  const facAddress = document.getElementById('facAddress');
  const facMapIframe = document.getElementById('facMapIframe');

  factoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      factoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-factory');
      const data = factoryData[key];

      if (data) {
        if (facTag) facTag.innerText = data.tag;
        if (facName) facName.innerText = data.name;
        if (facDesc) facDesc.innerText = data.desc;
        if (facCapacity) facCapacity.innerText = data.capacity;
        if (facMixers) facMixers.innerText = data.mixers;
        if (facAddress) facAddress.innerText = data.address;
        if (facMapIframe) facMapIframe.src = data.mapUrl;
      }
    });
  });

  // 5. Callback & Quick Order Modal Handling
  const callbackModal = document.getElementById('callbackModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalGradeField = document.getElementById('modalGradeField');

  const openModal = (gradeName = '') => {
    if (!callbackModal) return;
    callbackModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (gradeName && modalGradeField) {
      modalGradeField.value = gradeName;
      if (modalTitle) modalTitle.innerText = `${gradeName} — Tezkor Buyurtma`;
    } else {
      if (modalTitle) modalTitle.innerText = "Qo'ng'iroqqa Buyurtma Berish";
    }
  };

  const closeModal = () => {
    if (!callbackModal) return;
    callbackModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const grade = btn.getAttribute('data-grade') || '';
      openModal(grade);
    });
  });

  const openCallbackModalBtn = document.getElementById('openCallbackModal');
  if (openCallbackModalBtn) {
    openCallbackModalBtn.addEventListener('click', () => openModal());
  }

  const closeCallbackModalBtn = document.getElementById('closeCallbackModal');
  if (closeCallbackModalBtn) {
    closeCallbackModalBtn.addEventListener('click', closeModal);
  }

  if (callbackModal) {
    callbackModal.addEventListener('click', (e) => {
      if (e.target === callbackModal) closeModal();
    });
  }

  // 5.5 Product Detail Specifications Modal
  const productDetailModal = document.getElementById('productDetailModal');
  const closeDetailModalBtn = document.getElementById('closeDetailModal');
  const detailCubeImg = document.getElementById('detailCubeImg');
  const detailTitle = document.getElementById('detailTitle');
  const detailDesc = document.getElementById('detailDesc');
  const specBClass = document.getElementById('specBClass');
  const specFrost = document.getElementById('specFrost');
  const specWater = document.getElementById('specWater');
  const specMobility = document.getElementById('specMobility');
  const detailUsesList = document.getElementById('detailUsesList');
  const detailBuyBtn = document.getElementById('detailBuyBtn');

  const concreteSpecsData = {
    m100: {
      title: "Beton M100 (B7,5)",
      img: "/cubes/cube_m100.png",
      desc: "Poydevor tagi tayyorgarlik ishlari, yo'laklar va xomaki qurilish bosqichlari uchun mo'ljallangan yengil beton aralashmasi.",
      bClass: "B7.5 (98 kgf/cm²)",
      frost: "F50 - F75",
      water: "W2",
      mobility: "P3 (10-15 cm)",
      density: "2 250 – 2 300 kg/m³",
      uses: ["Poydevor tagi tayyorlov", "Yo'laklar tayyorlovi", "Beton yostiqchalar", "Xomaki pollar"],
      recipe: [
        { label: "Tsement M500", val: "215 kg" },
        { label: "Yuvilgan Qum", val: "790 kg" },
        { label: "Sheben (5-20mm)", val: "1 180 kg" },
        { label: "Suv (Toza)", val: "165 litr" },
        { label: "Plastifikator", val: "2.2 kg" }
      ],
      ingredients: [
        { title: "Sement M500", desc: "Tayyorlov va xomaki bosqichlar uchun mos nazoratli dozali Portland sement", img: "/ingredients/cement.png" },
        { title: "Yuvilgan Qum", desc: "Lom va changsiz yuvilgan daryo qumi (0-5mm)", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Standart 5-20mm fraksiyali mustahkam tosh sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Aralashmani gidratatsiya qilish uchun toza reaksion suv", img: "/ingredients/water.png" },
        { title: "Plastifikator", desc: "Baza oquvchanligini ta'minlovchi universal plastifikator", img: "/ingredients/additives.png" }
      ]
    },
    m150: {
      title: "Beton M150 (B12.5)",
      img: "/cubes/cube_m150.png",
      desc: "Qoplama, tayyorlov va yengil yuk tushadigan maydonchalar hamda bordyur o'rnatish ishlari uchun sertifikatlangan beton.",
      bClass: "B12.5 (163 kgf/cm²)",
      frost: "F50 - F100",
      water: "W2 - W4",
      mobility: "P3 (10-15 cm)",
      density: "2 300 – 2 350 kg/m³",
      uses: ["Pollar tayyorlov qatlami", "Piyodalar yo'lagi", "Bordyurlar o'rnatish", "Kottej poydevor tagi"],
      recipe: [
        { label: "Tsement M500", val: "250 kg" },
        { label: "Yuvilgan Qum", val: "760 kg" },
        { label: "Sheben (5-20mm)", val: "1 160 kg" },
        { label: "Suv (Toza)", val: "170 litr" },
        { label: "Plastifikator", val: "2.6 kg" }
      ],
      ingredients: [
        { title: "Sement M500", desc: "Piyodalar yo'lagi va bordyur tayyorlovi uchun sertifikatlangan sement", img: "/ingredients/cement.png" },
        { title: "Yuvilgan Qum", desc: "Gidravlik elangan daryo qumi", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Saralangan tosh fraksiyali sheben (5-20mm)", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Ishlab chiqarish texnologik toza suvi", img: "/ingredients/water.png" },
        { title: "Plastifikator", desc: "Aralashma bir jinsliligini saqlovchi plastifikator", img: "/ingredients/additives.png" }
      ]
    },
    m200: {
      title: "Beton M200 (B15)",
      img: "/cubes/cube_m200.png",
      desc: "Xususiy qurilishda eng ommabop va ko'p ishlatiladigan universal beton. Poydevor, pollar hamda zinapoyalar uchun ideal yechim.",
      bClass: "B15 (196 kgf/cm²)",
      frost: "F100",
      water: "W4",
      mobility: "P3 - P4 (15-20 cm)",
      density: "2 350 – 2 400 kg/m³",
      uses: ["Lenta poydevorlar", "Monolit pollar", "Zinapoyalar", "Yo'l va hovli plitalari"],
      recipe: [
        { label: "Tsement M500", val: "290 kg" },
        { label: "Yuvilgan Qum", val: "740 kg" },
        { label: "Sheben (5-20mm)", val: "1 140 kg" },
        { label: "Suv (Toza)", val: "170 litr" },
        { label: "Plastifikator", val: "3.0 kg" }
      ],
      ingredients: [
        { title: "Sement M500", desc: "Universal monolit va poydevorlar uchun sertifikatlangan M500 sement", img: "/ingredients/cement.png" },
        { title: "Yuvilgan Qum", desc: "Optimal granulometriyali toza yuvilgan qum", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Baza monolit va zinapoyalar uchun fraksiyalangan sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Gidratatsiya jarayoni uchun toza reaksion suv", img: "/ingredients/water.png" },
        { title: "Plastifikator", desc: "Monolit tekisligi va plastiqligini oshiruvchi qo'shimcha", img: "/ingredients/additives.png" }
      ]
    },
    m250: {
      title: "Beton M250 (B20)",
      img: "/cubes/cube_m250.png",
      desc: "Yuk ko'taruvchi monolit konstruksiyalar, qavatlararo yopmalar va mustahkam tayanch devorlar uchun mo'ljallangan beton.",
      bClass: "B20 (262 kgf/cm²)",
      frost: "F100 - F150",
      water: "W4 - W6",
      mobility: "P3 - P4 (15-20 cm)",
      density: "2 380 – 2 420 kg/m³",
      uses: ["Monolit poydevorlar", "Qavatlararo yopmalar", "Tayanch devorlar", "Zinapoya marshlari"],
      recipe: [
        { label: "Tsement M500", val: "320 kg" },
        { label: "Yuvilgan Qum", val: "730 kg" },
        { label: "Sheben (5-20mm)", val: "1 120 kg" },
        { label: "Suv (Toza)", val: "175 litr" },
        { label: "Plastifikator", val: "3.2 kg" }
      ],
      ingredients: [
        { title: "Sement M500", desc: "Yuk ko'taruvchi karkas va yopmalar uchun yuqori sinf sement", img: "/ingredients/cement.png" },
        { title: "Yuvilgan Qum", desc: "Yuqori darajada tozalaning daryo qumi", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Mustahkam granit tosh fraksiyali sheben (5-20mm)", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Laboratoriya nazoratidagi toza suv", img: "/ingredients/water.png" },
        { title: "Plastifikator", desc: "Monolit qotish barqarorligini ta'minlovchi superplastifikator", img: "/ingredients/additives.png" }
      ]
    },
    m300: {
      title: "Beton M300 (B22,5)",
      img: "/cubes/cube_m300.png",
      desc: "Ko'p qavatli turar-joy va tijorat binalarining poydevorlari, ustunlari va monolit karkaslari uchun yuqori mustahkamlikdagi beton.",
      bClass: "B22.5 (294 kgf/cm²)",
      frost: "F150 - F200",
      water: "W6",
      mobility: "P3 - P4 (15-20 cm)",
      density: "2 390 – 2 430 kg/m³",
      uses: ["Tayanch va yuk ko'taruvchi elementlar uchun", "Turar-joy va tijorat binolari poydevorlari uchun", "Qavat plitalari, monolit devorlar va ustunlar uchun", "Yo'l va trotuar plitalari uchun"],
      recipe: [
        { label: "Tsement M500", val: "350 kg" },
        { label: "Yuvilgan Qum", val: "710 kg" },
        { label: "Sheben (5-20mm)", val: "1 100 kg" },
        { label: "Suv (Toza)", val: "175 litr" },
        { label: "Plastifikator", val: "3.6 kg" }
      ],
      ingredients: [
        { title: "Sement M500", desc: "Ko'p qavatli monolit binolar uchun sinovdan o'tgan M500 Portland sement", img: "/ingredients/cement.png" },
        { title: "Yuvilgan Qum", desc: "Tozalangan saralangan yirik daryo qumi", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Yuqori mustahkamlikdagi saralangan sheben (5-20mm)", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Avtomatlashtirilgan dozali toza suv", img: "/ingredients/water.png" },
        { title: "Superplastifikator", desc: "Mustahkamlik va harakatlanuvchanlikni oshiruvchi modifikator", img: "/ingredients/additives.png" }
      ]
    },
    m350: {
      title: "Beton M350 (B25)",
      img: "/cubes/cube_m350.png",
      desc: "Monolit yopmalar, konsol va ustunlar, havzalar (basseyn) hamda aerodrom plitalari uchun o'ta mustahkam va suv o'tkazmaydigan beton.",
      bClass: "B25 (327 kgf/cm²)",
      frost: "F200",
      water: "W8",
      mobility: "P4 (18-22 cm)",
      density: "2 400 – 2 450 kg/m³",
      uses: ["Basseyn va havzalar", "Monolit konsollar", "Aerodrom plitalari", "Gidrotexnik tayanchlar"],
      recipe: [
        { label: "Tsement M500", val: "380 kg" },
        { label: "Yuvilgan Qum", val: "690 kg" },
        { label: "Sheben (5-20mm)", val: "1 080 kg" },
        { label: "Suv (Toza)", val: "180 litr" },
        { label: "Plastifikator", val: "4.0 kg" }
      ],
      ingredients: [
        { title: "Sement M500 Premium", desc: "Yuqori yuklamali monolitlar va basseynlar uchun premium sement", img: "/ingredients/cement.png" },
        { title: "Yuvilgan Qum", desc: "Mikro-teshiklarni to'ldiruvchi elangan qum", img: "/ingredients/sand.png" },
        { title: "Granit Sheben", desc: "Yuqori bosim va ayozga bardosh beruvchi granit sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Soflik va harorat nazoratidagi toza suv", img: "/ingredients/water.png" },
        { title: "Maxsus Modifikator", desc: "Suv o'tkazmaslik (W8) va ayozga chidamlilik qo'shimchasi", img: "/ingredients/additives.png" }
      ]
    },
    m400: {
      title: "Beton M400 (B30)",
      img: "/cubes/cube_m400.png",
      desc: "Ko'priklar, gidrotexnik inshootlar, tonnellar hamda maxsus davlat obyektlari uchun o'ta yuqori mustahkamlikdagi maxsus beton.",
      bClass: "B30 (393 kgf/cm²)",
      frost: "F200 - F300",
      water: "W8 - W10",
      mobility: "P4 (18-22 cm)",
      density: "2 420 – 2 480 kg/m³",
      uses: ["Ko'prik konstruksiyalari", "Gidrotexnik inshootlar", "Tonnellar", "Bank va maxsus saqlagichlar"],
      recipe: [
        { label: "Tsement M500", val: "415 kg" },
        { label: "Yuvilgan Qum", val: "670 kg" },
        { label: "Sheben (5-20mm)", val: "1 060 kg" },
        { label: "Suv (Toza)", val: "180 litr" },
        { label: "Plastifikator", val: "4.5 kg" }
      ],
      ingredients: [
        { title: "Sement M500", desc: "Ko'prik va tonnellar uchun o'ta yuqori faollikdagi sement", img: "/ingredients/cement.png" },
        { title: "Granitik Qum", desc: "Abrasiv yemirilmaydigan granit qum to'ldiruvchisi", img: "/ingredients/sand.png" },
        { title: "Granit Sheben", desc: "O'ta yuqori mustahkamlikdagi granit fraksion sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Gidratatsiya jarayoni uchun toza reaksion suv", img: "/ingredients/water.png" },
        { title: "Supermodifikator", desc: "Tez qotish va o'ta mustahkamlik superplastifikatori", img: "/ingredients/additives.png" }
      ]
    },
    m450: {
      title: "Beton M450 (B35)",
      img: "/cubes/cube_m450.png",
      desc: "To'g'onlar, metro tonnellari, harbiy va energetika ob'ektlari uchun mo'ljallangan maxsus o'ta chidamli beton aralashmasi.",
      bClass: "B35 (458 kgf/cm²)",
      frost: "F300",
      water: "W10 - W12",
      mobility: "P4 - P5 (20-25 cm)",
      density: "2 450 – 2 500 kg/m³",
      uses: ["To'g'on va dambalar", "Metro tonnellari", "Harbiy inshootlar", "Atom-energetika obyektlari"],
      recipe: [
        { label: "Tsement M500", val: "445 kg" },
        { label: "Yuvilgan Qum", val: "650 kg" },
        { label: "Sheben (5-20mm)", val: "1 040 kg" },
        { label: "Suv (Toza)", val: "185 litr" },
        { label: "Plastifikator", val: "5.0 kg" }
      ],
      ingredients: [
        { title: "Sement M500 D0", desc: "Metro va strategik inshootlar uchun qo'shimchasiz o'ta faol sement", img: "/ingredients/cement.png" },
        { title: "Saralangan Qum", desc: "O'ta toza va saralangan granuladagi daryo qumi", img: "/ingredients/sand.png" },
        { title: "Granit Sheben", desc: "B35 mustahkamlik sinfini ta'minlovchi og'ir granit sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Nazorat qilingan texnologik toza suv", img: "/ingredients/water.png" },
        { title: "Harbiy-Sanoat Modifikatori", desc: "Ekstremal yuk va bosim ostida deformatsiyasiz saqlovchi modifikator", img: "/ingredients/additives.png" }
      ]
    },
    tovar: {
      title: "Tovar Betoni",
      img: "/types/tovar_beton.png",
      desc: "Barcha turdagi qurilish ishlari uchun standart va sifatli tayyor beton aralashmasi. Zavod sharoitida avtomatlashtirilgan dozalash va 24/7 uzluksiz yetkazib berish.",
      bClass: "B15 - B30 (M200 - M400)",
      frost: "F100 - F200",
      water: "W4 - W6",
      mobility: "P3 - P4 (15-20 cm)",
      density: "2 350 – 2 420 kg/m³",
      uses: ["Poydevorlar va podvallar", "Qavatlararo monolit yopmalar", "Ustun va tayanch devorlar", "Xususiy hamda tijorat bino karkaslari"],
      recipe: [
        { label: "Tsement M500", val: "320 kg" },
        { label: "Yuvilgan Qum", val: "730 kg" },
        { label: "Sheben (5-20mm)", val: "1 120 kg" },
        { label: "Suv (Toza)", val: "175 litr" },
        { label: "Plastifikator", val: "3.2 kg" }
      ],
      ingredients: [
        { title: "Sement", desc: "Zavod dozirovkasidagi sertifikatlangan Portland M500 sement", img: "/ingredients/cement.png" },
        { title: "Qum", desc: "Zavodda yuvilgan va elangan daryo qumi", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Sifatli va saralangan 5-20mm fraktsiyali sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Gidratatsiya uchun nazorat ostidagi toza suv", img: "/ingredients/water.png" },
        { title: "Plastifikator", desc: "Mikser bilan logistika davomida aralashma holatini saqlovchi qo'shimcha", img: "/ingredients/additives.png" }
      ]
    },
    waterproof: {
      title: "Suvga Chidamli Beton",
      img: "/types/waterproof_beton.png",
      desc: "Namlik va suv ta'siriga chidamli gidrotexnik beton. Podvallar, rezervuarlar, basseynlar hamda yerosti inshootlarida namlik kirishining oldini oladi.",
      bClass: "B22.5 - B35 (W8-W12)",
      frost: "F200 - F300",
      water: "W8 - W12 (Yuqori)",
      mobility: "P4 (18-22 cm)",
      density: "2 400 – 2 460 kg/m³",
      uses: ["Podvallar va tsokol qavatlar", "Suv omborlari va rezervuarlar", "Basseyn va havzalar", "Yerosti parking va inshootlar"],
      recipe: [
        { label: "Tsement M500", val: "380 kg" },
        { label: "Yuvilgan Qum", val: "690 kg" },
        { label: "Sheben (5-20mm)", val: "1 080 kg" },
        { label: "Suv (Toza)", val: "175 litr" },
        { label: "Gidrofobik Qo'shimcha", val: "4.5 kg" }
      ],
      ingredients: [
        { title: "Sement", desc: "Suvga chidamli aralashmalar uchun moslashtirilgan M500 sement", img: "/ingredients/cement.png" },
        { title: "Qum", desc: "Mikro-teshiklarni kamaytiruvchi granulalangan toza qum", img: "/ingredients/sand.png" },
        { title: "Sheben", desc: "Zich joylashuvchi 5-20mm fraksiyali mustahkam sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Optimal kimyoviy nazoratdagi toza suv", img: "/ingredients/water.png" },
        { title: "Gidroizolyatsion qo'shimchalar", desc: "Betonning suv o'tkazmasligini oshiruvchi gidrofob modifikatorlar", img: "/ingredients/additives.png" }
      ]
    },
    road: {
      title: "Yo'l Betoni",
      img: "/types/road_beton.png",
      desc: "Yuqori yeyilishga va og'ir transport yuklamalariga chidamli maxsus beton. Magistral yo'llar, aerodromlar, terminal maydonlarida qo'llaniladi.",
      bClass: "B25 - B40 (M350 - M500)",
      frost: "F200 - F300",
      water: "W6 - W8",
      mobility: "P3 - P4 (12-18 cm)",
      density: "2 420 – 2 480 kg/m³",
      uses: ["Magistral avtomobil yo'llari", "Aerodrom uchish-qo'nish yo'laklari", "Logistika terminal maydonlari", "Og'ir yuk avtostansiyalari"],
      recipe: [
        { label: "Tsement M500", val: "400 kg" },
        { label: "Yuvilgan Qum", val: "680 kg" },
        { label: "Granit Sheben", val: "1 090 kg" },
        { label: "Suv (Toza)", val: "170 litr" },
        { label: "Mustahkamlovchi Modifikator", val: "4.8 kg" }
      ],
      ingredients: [
        { title: "Sement", desc: "Dinamik yuk va ishqalanishga chidamli Portland M500 sement", img: "/ingredients/cement.png" },
        { title: "Qum", desc: "Qattiq daryo tubi yuvilgan daryo qumi", img: "/ingredients/sand.png" },
        { title: "Granit Sheben", desc: "Og'ir avtomobillar yukiga va ishqalanishga bardosh beruvchi granit sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Zich qotish uchun aralashma suvi", img: "/ingredients/water.png" },
        { title: "Mustahkamlovchi Modifikator", desc: "Ayozga, tuzga va yeyilishga qarshi kompleks yo'l modifikatori", img: "/ingredients/additives.png" }
      ]
    },
    sand: {
      title: "Qum Betoni (Peskobeton)",
      img: "/types/sand_beton.png",
      desc: "Mayda fraksiyali yuvilgan qum va sement aralashmasi. Yirik shebensiz tayyorlanib, pol styajkalari va ta'mirlash ishlarida tekis qoplama beradi.",
      bClass: "B15 - B25 (M200 - M350)",
      frost: "F50 - F100",
      water: "W2 - W4",
      mobility: "P2 - P3 (8-14 cm)",
      density: "2 150 – 2 250 kg/m³",
      uses: ["Pol styajkalari va qoplamalar", "Gidroizolyatsiya tagi tayyorlov", "Monolit bloklar va ta'mirlash", "Pollar tekislash qatlami"],
      recipe: [
        { label: "Tsement M500", val: "450 kg" },
        { label: "Yuvilgan Qum (0-5mm)", val: "1 550 kg" },
        { label: "Suv (Toza)", val: "190 litr" },
        { label: "Plastifikator", val: "3.5 kg" }
      ],
      ingredients: [
        { title: "Sement", desc: "Peskobeton uchun yuqori ulushdagi M500 sement", img: "/ingredients/cement.png" },
        { title: "Mayda Qum", desc: "Mayda fraksiyali (0-5mm) yuvilgan daryo qumi", img: "/ingredients/sand.png" },
        { title: "Suv", desc: "Styajka oquvchanligini ta'minlovchi suv", img: "/ingredients/water.png" },
        { title: "Plastifikator", desc: "Pol yuzasi tekisligi va yorilishga qarshi plastifikator", img: "/ingredients/additives.png" }
      ]
    },
    fine: {
      title: "Mayda Donali Beton",
      img: "/types/fine_aggregate_beton.png",
      desc: "Yirik fraksiyali shebensiz, ingichka va murakkab armaturalangan konstruksiyalar hamda yupqa devorli elementlarni quyish uchun mo'ljallangan.",
      bClass: "B20 - B30 (M250 - M400)",
      frost: "F100 - F200",
      water: "W4 - W8",
      mobility: "P4 - P5 (18-24 cm)",
      density: "2 200 – 2 300 kg/m³",
      uses: ["Zich armaturalangan devorlar", "Yupqa monolit plitalar", "Arxitektura va dekorativ konstruksiyalar", "Murakkab shakldagi qoliplar"],
      recipe: [
        { label: "Tsement M500", val: "410 kg" },
        { label: "Mayda Qum", val: "850 kg" },
        { label: "Mikrosheben (3-8mm)", val: "920 kg" },
        { label: "Suv (Toza)", val: "180 litr" },
        { label: "Superplastifikator", val: "4.2 kg" }
      ],
      ingredients: [
        { title: "Sement", desc: "Ingichka qoliplarga tez to'luvchi sertifikatlangan sement", img: "/ingredients/cement.png" },
        { title: "Mayda Qum", desc: "Yupqa daryo qumi to'ldiruvchisi", img: "/ingredients/sand.png" },
        { title: "Mikrosheben", desc: "Kichik diametrli (3-8mm) mikrosheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Toza texnologik suv", img: "/ingredients/water.png" },
        { title: "Superplastifikator", desc: "Zich armatura orasidan osongina oquvchanlik beruvchi superplastifikator", img: "/ingredients/additives.png" }
      ]
    },
    sulfate: {
      title: "Sulfatga Chidamli Beton",
      img: "/types/sulfate_beton.png",
      desc: "Agressiv yerosti suvlari, sulfatlar va kimyoviy tuzlar ta'siriga chidamli maxsus sement asosidagi beton aralashmasi.",
      bClass: "B25 - B35 (M350 - M450)",
      frost: "F200 - F300",
      water: "W8 - W12",
      mobility: "P4 (16-20 cm)",
      density: "2 400 – 2 470 kg/m³",
      uses: ["Sho'rlangan yerosti suvlardagi poydevorlar", "Kanalizatsiya va kimyoviy inshootlar", "Sanoat korxona pollar", "Port va qirg'oq boyi tayanchlari"],
      recipe: [
        { label: "Sulfatga Chidamli Tsement", val: "420 kg" },
        { label: "Yuvilgan Qum", val: "670 kg" },
        { label: "Granit Sheben", val: "1 060 kg" },
        { label: "Suv (Toza)", val: "175 litr" },
        { label: "Kimyoviy Qo'shimcha", val: "5.0 kg" }
      ],
      ingredients: [
        { title: "Sulfatga Chidamli Sement", desc: "Agressiv sho'rlangan muhitga chidamli sulfatga chidamli sement", img: "/ingredients/cement.png" },
        { title: "Qum", desc: "Kimyoviy neytral va tozalaning daryo qumi", img: "/ingredients/sand.png" },
        { title: "Granit Sheben", desc: "Tuz va kimyoviy yemirilishga chidamli granit sheben", img: "/ingredients/gravel.png" },
        { title: "Suv", desc: "Laboratoriya nazoratidagi toza suv", img: "/ingredients/water.png" },
        { title: "Kimyoviy Qo'shimchalar", desc: "Yerosti tuzlari va sulfatlarga chidamlilik modifikatori", img: "/ingredients/additives.png" }
      ]
    }
  };

  let activeGradeForOrder = '';

  const openDetailModal = (gradeKey) => {
    if (!productDetailModal) return;
    const data = concreteSpecsData[gradeKey] || concreteSpecsData['m200'];
    activeGradeForOrder = data.title;

    if (detailCubeImg) detailCubeImg.src = data.img;
    if (detailTitle) detailTitle.innerText = data.title;
    if (detailDesc) detailDesc.innerText = data.desc;
    if (specBClass) specBClass.innerText = data.bClass;
    if (specFrost) specFrost.innerText = data.frost;
    if (specWater) specWater.innerText = data.water;
    if (specMobility) specMobility.innerText = data.mobility;

    const specDensity = document.getElementById('specDensity');
    if (specDensity) specDensity.innerText = data.density || '2 380 kg/m³';

    if (detailUsesList) {
      detailUsesList.innerHTML = data.uses.map(use => `<li>✓ ${use}</li>`).join('');
    }

    const detailRecipeItems = document.getElementById('detailRecipeItems');
    if (detailRecipeItems && data.recipe) {
      detailRecipeItems.innerHTML = data.recipe.map(r => `
        <span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.3rem 0.65rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #334155;">
          ${r.label}: <strong style="color: #0f172a;">${r.val}</strong>
        </span>
      `).join('');
    }

    const detailFullPageLink = document.getElementById('detailFullPageLink');
    if (detailFullPageLink) {
      detailFullPageLink.href = `product-details.html?grade=${gradeKey}`;
    }

    productDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDetailModal = () => {
    if (!productDetailModal) return;
    productDetailModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-detail]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gradeKey = btn.getAttribute('data-open-detail') || 'm100';
      window.location.href = `product-details.html?grade=${gradeKey}`;
    });
  });

  if (closeDetailModalBtn) {
    closeDetailModalBtn.addEventListener('click', closeDetailModal);
  }

  if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
      if (e.target === productDetailModal) closeDetailModal();
    });
  }

  if (detailBuyBtn) {
    detailBuyBtn.addEventListener('click', () => {
      closeDetailModal();
      openModal(activeGradeForOrder);
    });
  }

  // 5.8 Populator for Dedicated product-details.html Page
  const detailHeroTitle = document.getElementById('detailHeroTitle');
  if (detailHeroTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    const gradeKey = (urlParams.get('grade') || 'm300').toLowerCase();
    const data = concreteSpecsData[gradeKey] || concreteSpecsData['m300'];

    document.title = `${data.title} | REGION BETON Zavod Toshkent`;

    const breadcrumbGradeTitle = document.getElementById('breadcrumbGradeTitle');
    const detailHeroCubeImg = document.getElementById('detailHeroCubeImg');
    const detailHeroUsesPills = document.getElementById('detailHeroUsesPills');
    const detailHeroBuyBtn = document.getElementById('detailHeroBuyBtn');
    const recipeTabBtn = document.getElementById('recipeTabBtn');

    const tabDescP1 = document.getElementById('tabDescP1');
    const tabDescP2 = document.getElementById('tabDescP2');
    const recipeGrid = document.getElementById('recipeGrid');

    const tableBClass = document.getElementById('tableBClass');
    const tableFrost = document.getElementById('tableFrost');
    const tableWater = document.getElementById('tableWater');
    const tableMobility = document.getElementById('tableMobility');
    const tableDensity = document.getElementById('tableDensity');

    const detailTavsifImg = document.getElementById('detailTavsifImg');
    const detailIngrTitle = document.getElementById('detailIngrTitle');
    const ingredientsCardsContainer = document.getElementById('ingredientsCardsContainer');

    if (breadcrumbGradeTitle) breadcrumbGradeTitle.innerText = data.title;
    if (detailHeroTitle) detailHeroTitle.innerText = data.title;
    if (detailHeroCubeImg && detailHeroCubeImg.getAttribute('src') !== data.img) detailHeroCubeImg.src = data.img;
    if (detailTavsifImg && detailTavsifImg.getAttribute('src') !== data.img) detailTavsifImg.src = data.img;
    if (detailIngrTitle) detailIngrTitle.innerText = data.title;

    if (detailHeroUsesPills) {
      detailHeroUsesPills.innerHTML = data.uses.map(u => `
        <div class="use-pill-item">
          <span>${u}</span>
        </div>
      `).join('');
    }

    if (tabDescP1) tabDescP1.innerText = `${data.title} — ${data.desc}`;
    if (tabDescP2) {
      tabDescP2.innerText = `Ushbu mahsulot ${data.uses.join(', ').toLowerCase()} kabi mas'uliyatli va yuk ko'taruvchi inshootlarni barpo etish uchun ishlatiladi. REGION BETON zavodidan yetkazib beriladigan har bir partiya aralashma harakatlanuvchanligi va bir jinsliligi bilan ajralib turadi.`;
    }

    if (recipeGrid && data.recipe) {
      recipeGrid.innerHTML = data.recipe.map(r => `
        <div class="recipe-card-item">
          <h5>${r.label}</h5>
          <strong>${r.val}</strong>
        </div>
      `).join('');
    }

    if (tableBClass) tableBClass.innerText = data.bClass;
    if (tableFrost) tableFrost.innerText = data.frost;
    if (tableWater) tableWater.innerText = data.water;
    if (tableMobility) tableMobility.innerText = data.mobility;
    if (tableDensity && data.density) tableDensity.innerText = data.density;

    if (ingredientsCardsContainer && data.ingredients) {
      const topItems = data.ingredients.slice(0, 3);
      const bottomItems = data.ingredients.slice(3);

      let html = `
        <div class="ingredients-grid-top">
          ${topItems.map(item => `
            <div class="ingredient-card">
              <img src="${item.img}" alt="${item.title}" class="ingredient-img">
              <h4>${item.title}</h4>
              <p>${item.desc}</p>
            </div>
          `).join('')}
        </div>
      `;

      if (bottomItems.length > 0) {
        html += `
          <div class="ingredients-grid-bottom">
            ${bottomItems.map((item, idx) => {
              const isWide = idx === bottomItems.length - 1 && bottomItems.length % 2 !== 0;
              return `
                <div class="ingredient-card ${isWide ? 'ingredient-card-wide' : ''}">
                  <img src="${item.img}" alt="${item.title}" class="ingredient-img ${isWide ? 'ingredient-img-wide' : ''}">
                  <h4>${item.title}</h4>
                  <p>${item.desc}</p>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      ingredientsCardsContainer.innerHTML = html;
    }

    if (detailHeroBuyBtn) {
      detailHeroBuyBtn.addEventListener('click', () => openModal(data.title));
    }
  }

  // Tab Switcher for product-details.html
  const tabBtns = document.querySelectorAll('.prod-tab-btn');
  const tabContents = document.querySelectorAll('.prod-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // 6. Form Submission Notification Toast
  const handleFormSubmit = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.innerHTML = `
        <div class="toast-icon">✓</div>
        <div class="toast-content">
          <h4>Rahmat! Ariyangiz qabul qilindi.</h4>
          <p>Tez orada <strong>REGION BETON</strong> mutaxassisi siz bilan bog'lanadi!</p>
        </div>
      `;
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 4000);

      form.reset();
      closeModal();
    });
  };

  handleFormSubmit('quickOrderForm');
  handleFormSubmit('modalOrderForm');
  handleFormSubmit('contactPageForm');
  handleFormSubmit('calcOrderForm');

  // 7. Fast Link Prefetching on Hover for Instant Page Transitions
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
        let prefetchLink = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
        if (!prefetchLink) {
          prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        }
      }
    }, { once: true });
  });
});
