const Sequelize=require('sequelize');

//Analysis 는 통계를 위한 스키마임
module.exports = class Analysis extends Sequelize.Model{
    //모듈로 만들고 exports 함
    //User 모델은 Sequelize.Model을 확장한 클래스로 선언
    static init(sequelize){
        //static init과 static associate메서드가 있음
        //init은 테이블에 대한 설정을 함
        //associate는 다른 모델과의 관계를 적음
        return super.init({
            Store_code:{//사업자 등록번호
                type:Sequelize.STRING(10),
                allowNull:true,

            },
            Menu_name:{
                type:Sequelize.STRING(10),
                allowNull:true,
            },
            Menu_price:{//메뉴 가격
                type:Sequelize.INTEGER,
                allowNull:true,
            },
            Cnt:{//메뉴개수
                type:Sequelize.INTEGER,
                allowNull:true,
            },
            Time:{//비교를 위한 DATE값으로 이루어진 주문 일시
                type:Sequelize.DATE,
                allowNull:true,
            },
            Nick:{//가게에서 주문하면 가게명이, 앱에서 주문하면 주문자의 이름이 들어감
                type:Sequelize.STRING(20),
                allowNull:true,
            }
        
        },{
            sequelize,
            timestamps:false,
            underscored:false,
            modelName:'Analysis',
            tableName:'analysis',
            paranoid:false,
            charset:'utf8',
            collate:'utf8_general_ci',
        });

    }
    static associate(db){}
};