const Sequelize=require('sequelize');
const { User } = require('.');

module.exports = class Store extends Sequelize.Model{
    //모듈로 만들고 exports 함
    //User 모델은 Sequelize.Model을 확장한 클래스로 선언
    static init(sequelize){
        //static init과 static associate메서드가 있음
        //init은 테이블에 대한 설정을 함
        //associate는 다른 모델과의 관계를 적음
        return super.init({
            Store_code:{//사업자등록번호
                type:Sequelize.STRING(10),
                allowNull:false,
                primaryKey:true,
                
            },
            Status:{//영업여부 0:영업안함 1:영업중
                type:Sequelize.INTEGER,
                allowNull:false,

            },
            Table_cnt:{//테이블개수
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:false,
            },
            Nick:{//가게명
                type:Sequelize.STRING(10),
                allowNull:true,
            },
            category:{//카테고리
                type:Sequelize.STRING(10),
                allowNull:true,
            },
            latitude:{//위도
                type:Sequelize.DOUBLE,
                allowNull:false,
            },
            longitude:{//경도
                type:Sequelize.DOUBLE,
                allowNull:false,
            },
            
        },{
            sequelize,
            timestamps:false,
            underscored:false,
            modelName:'Store',
            tableName:'stores',
            paranoid:false,
            charset:'utf8',
            collate:'utf8_general_ci',
        });

    }
    static associate(db){
        db.Store.hasMany(db.Menu,{foreignKey:'Store_code',sourceKey:'Store_code'});
        db.Store.hasMany(db.Order,{foreignKey:'Store_code',sourceKey:'Store_code'});
        db.Store.hasMany(db.Reserve,{foreignKey:"Store_code",sourceKey:"Store_code"});
        db.Store.belongsTo(db.User,{foreignKey:'Store_code',targetKey:'ID'});
        //1:N 관계에서는 1에는 hasMany로 설정하면 알아서 JOIN함
        //N인 곳도 설정해줘야 함 belongsTo로 함
        //hasMany모델에선 sourceKey사용한다고 생각
        //foreignKey따로 설정안하면 모델명+기본키가 합쳐진 UserId가 foreignKey로 생성됨
    }
};