import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/database";

class User extends Model {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
    phoneNumber!: string;
    gender!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
        sequelize,
        modelName:'User',
        timestamps:true
}
)

export default User;