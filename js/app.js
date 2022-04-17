// Variables
let pomodoroTime = 25,
    shortTime = 5,
    longTime = 15,
    delayBar = localStorage.getItem('delay') || 60,
    actualTime = localStorage.getItem('actualTime'),
    timeActiveTab = localStorage.getItem('timeActiveTab'),
    interval;

// Dom elements and options
const timeELem = document.getElementById('time'),
      switchBtn = document.getElementById('timeBtn'),
      tabs = document.querySelectorAll('.tab'),
      activeTab = document.getElementById(localStorage.getItem('tab')) 
        || document.getElementById('timer'),
      circle = document.querySelector('.progress-ring__circle'),
      radiusCircle = parseInt(getComputedStyle(circle).r),
      circumference = 2 * Math.PI * radiusCircle;

// Funсtions
// Render actual time
const renderTime = (time) => {
  const minutes = Math.trunc(time / 60);
  const seconds = time - (minutes * 60);

  const minutesRender = minutes > 9 ? `${minutes}:` : `0${minutes}:`; 
  const secondsRender = seconds > 9 ? `${seconds}` : `0${seconds}`; 

  timeELem.innerText = minutesRender + secondsRender; 
};

// render progress bar
const renderProgressBar = (percent) => {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
};

// set percent for progress bar
const setPercentBar = (actualSeconds) => {
  const percent = ((actualSeconds / 60) / timeActiveTab) * 100;
  renderProgressBar(percent);
};

// decrease actual time
const decreaseTime = () => {
  if (actualTime === 0) {
    localStorage.removeItem('actualTime');
    switchBtn.innerText = 'restart';
    clearInterval(interval);
    renderProgressBar(100);
    return;
  }

  delayBar--;
  actualTime--;
  localStorage.setItem('actualTime', actualTime);
  localStorage.setItem('delay', delayBar);
  
  if (!delayBar) {
    setPercentBar(actualTime);
    delayBar = 60;
  }
  renderTime(actualTime);
};

// set active time by active tab
const setActiveTime = () => {
  tabs.forEach((tab, index) => {
    if (tab.classList.contains('tab-active')) {
      actualTime = (index === 0) ? pomodoroTime :
        (index === 1) ? shortTime : longTime;
      timeActiveTab = actualTime;
      actualTime *= 60;
      localStorage.setItem('timeActiveTab', timeActiveTab);
    }
  });
};

// set active tab
const setActiveTab = (newTab) => {
  tabs.forEach(tab => tab.classList.remove('tab-active'));
  newTab.classList.add('tab-active');
};

// Start position
// Progress bar
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

setActiveTab(activeTab);
if (!actualTime) {
  setActiveTime();
  renderProgressBar(100);
}

setPercentBar(actualTime);
renderTime(actualTime);

// start, pause, restart
switchBtn.addEventListener('click', (event) => {
  const currentValue = event.target.innerText.toLowerCase();

  if (currentValue === 'start') {
    switchBtn.innerText = 'pause';
    interval = setInterval(decreaseTime, 1000);
  } else if (currentValue === 'pause') {
    switchBtn.innerText = 'start';
    clearInterval(interval);
  } else {
    switchBtn.innerText = 'pause';
    setActiveTime();
    interval = setInterval(decreaseTime, 1000);
  }
});

// tabs: pomodoro, short and long break
tabs.forEach(tab => {
  tab.addEventListener('click', (event) => {
    const current = event.target;

    localStorage.removeItem('actualTime');
    localStorage.removeItem('delay');
    localStorage.setItem('tab', current.id);

    delayBar = 60;
    switchBtn.innerText = 'start';
    clearInterval(interval);
    setActiveTab(current);
    setActiveTime();
    renderTime(actualTime);
    renderProgressBar(100);
  });
});