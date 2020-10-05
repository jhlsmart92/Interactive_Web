//전역변수 회피
//즉시 실행함수 만들기.
//함수 안에서 정의된 변수들은 전역변수가 아니기 때문에 밖에서 접근이 안됨
(function() {
    //스크롤을 했을 시, 벽들을 포함하고 있는 하우스를 이동
    const stageElem = document.querySelector('.stage'); // 마우스 이동시 시점이동위해 스테이지 끌어옴. 하우스와 캐릭터를 같이 움직여야 하므로 스테이지가 필요.
    const houseElem = document.querySelector('.house');
    const barElem = document.querySelector('.progress-bar'); // 프로그래스 바 클래스
    const selectCharacterElem = document.querySelector('.select-character'); //캐릭터 선택 버튼
    const mousePos = {x: 0, y: 0 };
    let maxScrollValue;

    function resizeHandler() { // 스크롤 할 때마다 maxscrollvalue 다시 설정
        maxScrollValue = document.body.offsetHeight - window.innerHeight;
    }
    //바디전체의 높이에서 현재창사이즈 빼줌
    window.addEventListener('scroll',function(){ // 스크롤 이벤트 일어날 때 마다 zMove값조정
        //console.log(pageYOffset); // 얼만큼 스크롤을 했는지 수치를 보여줌
        //가장 아래로 내려갔을 때의 수치는 스크롤바의 크기를 뺀 수치 
        //따라서 바디전체의 높이에서 스크롤바를 빼줘야 스크롤 되는 높이
        //console.log(maxScrollValue);
        const scrollPer = pageYOffset / maxScrollValue;
        const zMove = scrollPer * 970-490;
        //얼마나 스크롤 했는지 비율 곱하기 950. 950 곱한 이유는 끝까지 안가게 하기 위함
        //하우스가 -490이므로 490 빼줌
        //console.log(zMove);
        houseElem.style.transform = 'translateZ('+zMove+'vw)'; // 0부터 1000까지 z방향으로 이동
        //스크롤하기전엔 -490이었으나, 스크롤 하며 0이 되어서 부자연스러운 움직임 보임

        //progress bar
        barElem.style.width = scrollPer * 100 + '%'; // 프로그래스바 클래스의 넓이
    });

    //마우스 움직일 때마다 시점 바뀌도록
    window.addEventListener('mousemove', function(e) {
        //console.log(e.clientX, e.clientY); // 클릭해야 찍히는 문제 발생? 가운데 있을 때 0이되어야 쓰기 편함. 
        //중앙을 0으로 두고 왼쪽은 -1, 오른쪽은 1, 아래는 -1, 위는 1로 설정하면 회전시키기 편함
        mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
        mousePos.y = 1 - (e.clientY / window.innerHeight) * 2; //자주쓰는 표현
        //console.log(mousePos);
        stageElem.style.transform = 'rotateX(' + (mousePos.y*5) + 'deg) rotateY(' + (mousePos.x*5) + 'deg)';
        //x축기준 회전은 y 포지션의 영향을 받음
        //반대로 y축기준 회전은 x포지션의 영향을 받음
    });


    // 창사이즈가 바뀔 때마다 생기는 문제 해결하기 위함
    window.addEventListener('resize',resizeHandler); // 스크롤 이벤트 발생시 함수실행
    resizeHandler(); // 처음 시작했을 때 실행

    stageElem.addEventListener('click',function(e) {
        //console.log(e.clientX / window.innerWidth); // 전체 폭분에 현재 클릭한 위치의 비율
        new Character({ // 위의 비율을 xpos라는 객체에 넣음(즉 비율을 객체의 속성으로 넣음) 이렇게 하면 추후에 다른기능도 추가가능. 객체에 필요한 속성을 계속 추가가능
            xPos: e.clientX / window.innerWidth * 100, // 캐릭터 놓는 위치
            speed: Math.random()*0.3 + 0.2 // 캐릭터마다 속도 다르게 곱하는 수를 줄이면 속도 차이가 크게 안나게 됨. 최소 0.2는 되게.
        });
    });

    selectCharacterElem.addEventListener('click',function(e) {
        //console.log(e.target.getAttribute('data-char')); // 타겟의 데이터캐릭터가 일분이인지 라걸인지
        const value = e.target.getAttribute('data-char'); // 
        document.body.setAttribute('data-char',value);
    });

    //new Character(); // 캐릭터 생성자 실행(new 키워드 필요)

}) ();
