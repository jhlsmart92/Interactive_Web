        const menu = document.querySelector('.menu');


        function clickHandler(event) { //event: 이벤트 객체로 지금일어난 이벤트에 대한 정보 가지고 있음
            console.log(this); //이벤트 객체의 current target 
            console.log(event.currentTarget); //이벤트 객체의 current target
            console.log(event.target);
            //이벤트 객체의 target. 이때 아이콘이나 텍스트를 누르면 아이콘이나 텍스트 반환함.
            //즉 버튼 안의 요소들 참조함
            //console.log(event.target.getAttribute('data-value')); // getAttribute는 data-의 값을 받아옴
            console.log(event.target.dataset.value); // dataset은 data-value의 값을 속성이름으로 가지는 객체
            //이 경우 아이콘과 텍스트는 null 반환함
            // css style에서 아이콘과 텍스트에 pointer-events: none 써주어 해결
            // 이 경우 아이콘과 텍스트는 클릭이벤트를 받지 않게됨.
            let elem = event.target; // 이벤트 타겟
            while (!elem.classList.contains('menu-btn')) { //elem이 menu-btn 클래스를 가지고 있지 않으면
                elem = elem.parentNode; // elem에 부모요소 할당. 
                //따라서 아이콘이나 텍스트 누르면 부모인 menu-btn 할당
                //그러나 menu 영역을 클릭하면 상위노드인 바디로 올라감. 
                //바디에는 클래스가 없으므로, 에러가 나게 됨.
                if (elem.nodeName == 'BODY') { // 메뉴 부분을 눌러 상위 클래스인 바디로 올라갔을 때
                    elem = null;
                    return; // elem에 null 할당 후 while 빠져나옴
                }
            }
            console.log(elem.dataset.value);
            //두가지 방법: 부모노드를 타고 올라가는 방법과, css에서 pointer-events 를 이용하는 방법
            //pointer-events를 사용하게 되면 깔끔하긴 하나,
            //하위 클래스를 타겟으로 잡을 수 없어, 복잡한 구조의 HTML이라면 설정하지 않는게 좋음.
        }

        menu.addEventListener('click', clickHandler);

        window.addEventListener('click', () => {

            const htmlStr = '\
            <button class="menu-btn" data-value="1">\
            <img class="icon" src="images/ilbuni_1.png" alt="">\
                <span class="btn-label">일분이1</span>\
            </button>\
            <button class="menu-btn" data-value="2">\
                <img class="icon" src="images/ilbuni_2.png" alt="">\
                <span class="btn-label">일분이2</span>\
            </button>\
            <button class="menu-btn" data-value="3">\
                <img class="icon" src="images/ilbuni_3.png" alt="">\
                <span class="btn-label">일분이3</span>\
            </button>\
            ';
            menu.innerHTML = htmlStr;
        });

        //버튼부분 주석처리 했을 때 윈도우 아무곳이나 클릭했을시 버튼과 이벤트 불러오도록(이벤트위임)