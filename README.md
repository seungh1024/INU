## 인천대학교 캡스톤디자인 졸업작품: POS(POS for Offline Services)
>오프라인 상점에서 사용하기 위한 온라인 주문 시스템

##### 기획 의도
  * 오프라인 매장을 이용하며 해당 매장의 잔여 테이블 수, 혹은 휴점일 등을 쉽게 알 수 없습니다. 이를 해결하기 위해 전화를 할 수 있지만 매장의 상황에 따라 전화를 못받는 경우도 있습니다. 또한 주문을 사람이 받다보니 주문누락 및 오주문도 생깁니다. 점주에게 포스기의 큰 가격도 부담입니다. 이런 불편함을 해결하기 위해 해당 아이디어를 구상했습니다.
  

#### 팀 구성
  * 3인(Android 2, Backend 1)

#### 담당 역할
  * 아이디어 기획
  * Backend 전체 개발


#### 기능
* 매장 위치 및 잔여 테이블 확인
* 매장 메뉴 확인 및 주문
* 주문을 받은 포스기 앱에서 주문 확인 및 처리
* 포스기 앱에 제공하는 주문 통계

#### 동작순서
* 이용자 앱(2~5 반복)

 <img src="https://user-images.githubusercontent.com/77014020/131608621-3fb70543-2678-43aa-815d-163b0d0047a4.png" width = "600" hight = "1200"><img src="https://user-images.githubusercontent.com/77014020/131608062-d149cf26-9d79-4992-b92a-472d671b41ab.png" width = "600" hight = "1200">
    <img src="https://user-images.githubusercontent.com/77014020/131608779-c3abf3f0-54d1-4f8f-b07f-fb6ab8e4c7a2.png" width = "600" hight = "1200">
    <img src="https://user-images.githubusercontent.com/77014020/131609289-43fd2d19-a218-4ab6-8b1b-0cd0c67e71e2.png" width = "600" hight = "1200"><img width="140" alt="스크린샷 2021-09-01 오후 12 57 16" src="https://user-images.githubusercontent.com/77014020/131609383-ace1fe79-0609-4d6a-bfa0-9c4ecb6f97c7.png">


    1. 로그인 
    2. 탐색 위치 설정
    3. 카테고리별 주변 가게 확인 및 선택
    4. 메뉴 주문
    5. 결제

* 매장 앱(2~4반복)

 <img src="https://user-images.githubusercontent.com/77014020/131609896-4f0f86b5-c598-4090-964c-2856c5e8bcf6.jpeg" width = "400" hight = "800"><img src="https://user-images.githubusercontent.com/77014020/131609819-87c0a897-7d24-4888-808e-e85f87625c3c.png" width = "400" hight = "800">
    <img src="https://user-images.githubusercontent.com/77014020/131609913-60921133-3b98-4ea1-88e5-de214465b1e1.png" width = "400" hight = "800"><img src="https://user-images.githubusercontent.com/77014020/131609918-9268acf5-b63b-451a-8586-2cb50265a6d1.png" width = "400" hight = "800">
    <img src="https://user-images.githubusercontent.com/77014020/131609922-b3cf3969-3557-4cce-948c-5bdd28af6981.png" width = "400" hight = "800">
    




    1. 로그인
    2. 오프라인 주문 입력 또는 온라인 주문 확인
    3. 주문 완료 처리
    4. 계산
    5. 통계 확인

#### 후기
> 나의 첫 프로젝트여서 모든게 처음이고 새로웠고 그래서 막힘이 많았다. Nodejs를 공부한지 5개월정도 되었을 때 일단 개발을 시작했고 부족한 지식에 여러 자료들을 참고하고 그만큼 시간이 많이 들었다. 데이터베이스에 대한 지식이 없었고 해당 학기에 데이터베이스 강좌가 폐강됐기 때문에 들을 수 없었다. 그래서 Nodejs 공부와 함께 SQLD책을 사서 공부를 병행했다. 모두 혼자서 공부했기 때문에 시퀄라이즈를 이용한 복잡한 쿼리문 처리에 많은 어려움을 겪었고 그 때마다 구글에서 공식문서를 번역하여 정리한 어느 블로그를 보고 해결했다. 아이디어는 내가 제공하여 욕심이 많았지만 부족한 지식 때문에 많이 아쉬웠다. 그래도 해당 프로젝트를 하며 요청에 대한 데이터베이스 작업을 하고 응답을 하는 것에 대해 많이 공부하고 이해하게 되었다. 로그인을 제대로 구현하고 결제까지 완벽하게 구현한는 등의 개선을 통해 실제로 사용이 된다면 좋을 것 같다는 생각이다.

#### 졸업작품 제출 및 기능 설명
* 아이디어 붐:<http://www.ideaboom.net/page/project_detail.php?seq=2114>
