import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/database";

class Expense extends Model {
    id!: number;
    expenseName!: string;
    expenseDescription!: string;
    expenseAmount!: number;
    UserId!: number;
}

Expense.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    expenseName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    expenseDescription: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    expenseAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        sequelize,
        modelName: 'Expense',
        timestamps: true
    }
)

export default Expense;