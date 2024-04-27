import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({ tableName: 'sessions' })
class Session extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @BelongsTo(() => User)
    declare user: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare userAgent: string;
}

export default Session;