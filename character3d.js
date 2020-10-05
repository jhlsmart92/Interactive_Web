function Character(info) { // 객체를 매개변수로 설정
    //자바스크립트의 함수는 객체지향 가능하며, 함수의 인자로 전달 가능하다.
    this.mainElem = document.createElement('div'); //div 생성
    this.mainElem.classList.add('character'); //character라는 클래스 div에 넣어줌
    this.mainElem.innerHTML = '' // div 안에 하기의 문자열 넣음
        +
        '<div class="character-face-con character-head">' +
        '<div class="character-face character-head-face face-front"></div>' +
        '<div class="character-face character-head-face face-back"></div>' +
        '</div>' +
        '<div class="character-face-con character-torso">' +
        '<div class="character-face character-torso-face face-front"></div>' +
        '<div class="character-face character-torso-face face-back"></div>' +
        '</div>' +
        '<div class="character-face-con character-arm character-arm-right">' +
        '<div class="character-face character-arm-face face-front"></div>' +
        '<div class="character-face character-arm-face face-back"></div>' +
        '</div>' +
        '<div class="character-face-con character-arm character-arm-left">' +
        '<div class="character-face character-arm-face face-front"></div>' +
        '<div class="character-face character-arm-face face-back"></div>' +
        '</div>' +
        '<div class="character-face-con character-leg character-leg-right">' +
        '<div class="character-face character-leg-face face-front"></div>' +
        '<div class="character-face character-leg-face face-back"></div>' +
        '</div>' +
        '<div class="character-face-con character-leg character-leg-left">' +
        '<div class="character-face character-leg-face face-front"></div>' +
        '<div class="character-face character-leg-face face-back"></div>' +
        '</div>';
    //stage에 위의 내용을 붙여 넣어야
    document.querySelector('.stage').appendChild(this.mainElem);
    console.log(this); //undefined
    console.log(info); //xpos 객체를 제대로 받아왔는지 확인
    this.mainElem.style.left = info.xPos + '%'; // 클릭한 곳에 캐릭터 생성위해
    this.scrollState = false; // 스크롤 중인지 아닌지 체크하는 변수

    this.lastScrollTop = 0; //바로 이전(마지막) 스크롤 위치
    this.xPos = info.xPos; //캐릭터의 레프트값을 개체의 속성으로 등록
    this.speed = info.speed; //방향키를 누르면 스피드 값만큼 이동하도록
    console.log(this.speed);
    this.direction; // 방향 판별위해
    this.runningState = false; //좌우 이동중인지 아닌지 판별
    this.rafId;
    this.init(); // 프로토타입함수의 init메소드 실행
}

Character.prototype = { // 새로운 캐릭터 객체인 프로토타입속성을 재정의
    constructor: Character, //새로운 객체다시 만들때는 constructor 속성을 만들어줌
    init: function () {
        //console.log(this);// 캐릭터
        const self = this; // 따라서 이를 다른 변수에 넣어놓고 이 변수를 this대신 사용
        window.addEventListener('scroll', function () {
            clearTimeout(self.scrollState); // self.scrollState를 스크롤 할 때마다 계속지움
            //console.log('init 실행확인')
            if (!self.scrollState) {
                //스크롤 할 때마다 self.scrollState가 지워지므로,  running 클래스가 붙게됨
                self.mainElem.classList.add('running'); // this.mainElem 정의 되있어야. 
                //이 함수는 이벤트가 일어나야 실행되는 이벤트 리스너임. 이벤트 핸들러 안에서 this가 가리키는 것은 window임
                //즉 addEventListner를 실행한 주체인 window를 가리킴
                //우리가 원하는 this는 캐릭터생성자로 생성해낸 instance 객체
                //console.log(this); //윈도우
                //console.log('running 클래스 붙임')
            }

            self.scrollState = setTimeout(function () { //scroll 실행후 0.5초 뒤 함수 실행,
                //그러나 시작과 동시에 self.scrollState에 숫자는 세팅됨
                //스크롤이 끝나면 더이상 클리어 되지 않으므로 0.5초위 함수 실행되며 running 없어짐
                self.scrollState = false;
                self.mainElem.classList.remove('running');
            }, 500);

            //이전스크롤 위치와 현재 스크롤 위치를 비교
            if (self.lastScrollTop > pageYOffset) {
                //이전 스크롤 위치가 크다면: 스크롤 올린것,
                self.mainElem.setAttribute('data-direction', 'backward');
            } else {
                //현재 스크롤 위치가 크다면: 스크롤 내린것, 
                self.mainElem.setAttribute('data-direction', 'forward');
            }

            self.lastScrollTop = pageYOffset;

            //console.log('lastScrollTop: ' + self.lastScrollTop); //이전턴의 스크롤 위치가 찍힘(두줄아래줄)
            //console.log('pageYOffset: ' + pageYOffset); // 현재 스크롤 위치
            self.lastScrollTop = pageYOffset; // 마지막으로 스크롤한 위치(스크롤 한번이 끝나는 시점에 체크)
            //스크롤을 내릴땐 이전스크롤 보다 현재값이 더 클 것이고, 
            //스크롤을 올릴땐 이전스크롤이 현재값보다 더 큼.
        });

        window.addEventListener('keydown', function (e) { // 키보드를 눌렀을 때
            if (self.runningState) return; // true 면 실행하지 않고 나감

            //console.log(e.keyCode); //왼쪽 화살표37, 오른쪽 화살표39
            if (e.keyCode == 37) {
                self.direction = 'left';
                self.mainElem.setAttribute('data-direction', 'left'); //왼쪽
                self.mainElem.classList.add('running');
                //self.xPos -= self.speed;
                //self.mainElem.style.left = self.xPos + '%';
                //현재 움직임이 끊기는 듯한 문제있음. 프레임이 너무 적음.
                //고로 requestanimationframe 사용
                self.run(self); 
                self.runningState = true; // false면 실행하면서 true로 바꿈
                //키를 계속 누르고 있으면 이벤트리스너가 계속 실행되며 true값 들어옴
                //그러나 return 되며 나가기 때문에
                //키를 아무리 누르고 있어도 한번만 시행됨
            } else if (e.keyCode == 39) {
                self.direction = 'right';
                self.mainElem.setAttribute('data-direction', 'right'); //오른쪽
                self.mainElem.classList.add('running');
                //self.xPos += self.speed;
                //self.mainElem.style.left = self.xPos + '%';
                self.run(self);
                self.runningState = true;
                //키를 떼면 러닝은 멈추나 이동은 계속함 이를 해결하기 위해 rafId 필요
                //한번 키떼면 멈추고 다시 가지 않는 현상 해결해야.
            }
        });




        window.addEventListener('keyup', function (e) { // 키보드를 뗏을 때
            self.mainElem.classList.remove('running'); //러닝 클래스 없앰
            cancelAnimationFrame(self.rafId); // runningstate true인 상태로 멈춤
            self.runningState = false; // true인 상태로 멈추면 다시 keydown 했을때실행이 안됨
            //따라서 false로 다시 초기화시켜줌
        });

    },

    run: function (self) { //requestanimationframe 사용 위한 새로운 함수
        //const self = this;
        //console.log(self.xPos); // 캐릭터의 위치 보기 위해
        if (self.direction == 'left') {
            self.xPos -= self.speed;
        }else if (self.direction == 'right') {
            self.xPos += self.speed;
        }
        // 양쪽 벽에 부딪혔을 때 더 안가도록
        if (self.xPos < 2){
            self.xPos = 2;
        }
        if (self.xPos > 88) {
            self.xPos = 88;
        }

        //console.log(self);// 이 상태에서 돌리면 처음엔 캐릭터를 참조하다가 갑자기 윈도우 전역객체를 참조함
        //mainElem 안에는 윈도우 전역객체가 없으므로 에러가 남
        //이는 context가 바껴서 this가 가리키는 것이 윈도우 전역객체로 바뀌었기 때문.
        //즉 this가 self가 아닌 다른것을 참조하여 생기는 문제
        //이는 두가지 방법으로 해결가능
        //첫번째로 함수의 매개변수로 전달해서 this를 살리는 방법이 있음
        //두번째로 bind 메소드를 지정해서 직접 this를 지정
        self.mainElem.style.left = self.xPos + '%'; 
        // 캐릭터 이동위해 x 포지션 값을 mainElem으로 갱신

        //requestAnimationFrame(self.run); //반복시킴
        self.rafId = requestAnimationFrame(function () { // keyup시 캔슬시키려면 반환되는 속성을 이용해야함
            self.run(self);
        }); // 동작은 하나 너무 빠르게 감.이는 keydown 시 키를 연타하는 효과 때문
    }
//bind 사용하는 방식
//     run: function () { 
//         const self = this;

//         if (self.direction == 'left') {
//             self.xPos -= self.speed;
//         } else if (self.direction == 'right') {
//             self.xPos += self.speed;
//         }
 
//         if(self.xPos < 2) {
//             self.xPos = 2;
//         }

//         if (self.xPos > 88) {
//             self.xPos = 88;
//         }

//         self.mainElem.style.left = self.xPos + '%';

//         self.rafId = requestAnimationFrame(self.run.bind(self));
//         //bind 메소드를 수행할 때 첫번째 인자가 this 가 됨
//     }
}