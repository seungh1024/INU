# 인천대학교 캡스톤디자인 졸업작품: POSS(POS For Offline Services)
오프라인 상점에서 사용하기 위한 온라인 주문 시스템

## 기획 의도
> 매장 잔여 테이블 확인
  * 매장 잔여 좌석이 없을 경우 계속 돌아다녀야 하는 불편함
> 주문시 불편함
  * 주문 할 때 기다려야하는 불편함
  * 구술로 주문하여 생기는 오해와 잘못된 주문들
> 해당 불편함들을 해결하기 위해 배달 앱이 발달된 것 처럼 오프라인 매장을 위한 서비스도 있으면 좋다고 생각.
> 이를 해결하기 위해 스마트폰으로 해당 매장의 정보를 볼 수 있으며 주문 및 결제까지 할 수 있는 앱을 구상함.


## 기능
* 매장 위치 및 잔여 테이블 확인
* 매장 메뉴 확인 및 주문 기능
* 주문을 받은 포스기 앱에서 주문 확인 및 처리
* 포스기 앱에 제공하는 주문 통계


## 서버 역할
> 데이터베이스에 매장,주문 정보 저장후 이를 활용한 요청에 대한 응답처리
1. 매장 정보 저장
2. 사용자에게 매장 정보 제공
3. 주문관련 요청 처리
4. 매장에 통계 데이터 제공
