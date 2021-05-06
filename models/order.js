const Sequelize=require('sequelize');
const { User } = require('.');

module.exports = class Order extends Sequelize.Model{
    //모듈로 만들고 exports 함
    //User 모델은 Sequelize.Model을 확장한 클래스로 선언
    static init(sequelize){
        //static init과 static associate메서드가 있음
        //init은 테이블에 대한 설정을 함
        //associate는 다른 모델과의 관계를 적음
        return super.init({
            Store_code:{//사업자등록번호
                type:Sequelize.STRING(20),
                allowNull:false,
                primaryKey:true,
            },
            Menu_name:{//메뉴명
                type:Sequelize.STRING(20),
                allowNull:false,
                primaryKey:true,
            },
            Cnt:{//메뉴개수
                type:Sequelize.INTEGER,
                allowNull:false,
                primaryKey:true,
            },
            Table_num:{//테이블 번호 0이면 배달 및 포장
                type:Sequelize.INTEGER,
                allowNull:false,
                primaryKey:true,
            },
            Cook:{//조리여부
                type:Sequelize.INTEGER,
                allowNull:false,
            },
            Pay:{//결제여부
                type:Sequelize.INTEGER,
                allowNull:false,
            },
            
            Time:{//주문시각을 저장함
                type:Sequelize.DATE,
                allowNull:true,
                defaultValue:Sequelize.NOW,
                primaryKey:true,
            },
            Nick:{
                type:Sequelize.STRING(10),
                allowNull:true,
            }
        
        },{
            sequelize,
            timestamps:false,
            timezone:"+09:00",
            underscored:false,
            modelName:'Order',
            tableName:'orders',
            paranoid:false,
            charset:'utf8',
            collate:'utf8_general_ci',
        });

    }
    static associate(db){
        db.Order.belongsTo(db.Store,{foreignKey:'Store_code',targetKey:'Store_code'});
        db.Order.belongsTo(db.Menu,{foreignKey:'Store_code',targetKey:'Store_code'});
       }
};