import bcrypt from 'bcrypt';
import config from 'config';
import { Table, Model, Column, DataType, BeforeCreate, BeforeUpdate, HasMany } from 'sequelize-typescript';
import Session from './session.model';
import Post from './post.model';

@Table({ tableName: 'users' })
class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({
        unique: true,
        allowNull: true
    })
    declare googleId: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare middleName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare lastName: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: true,
        validate: {
            isIn: [['user', 'admin']]
        },
        defaultValue: 'user'
    })
    declare role: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare title: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare country: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: {
            name: 'users_username',
            msg: 'An account with this username already exists.'
        }
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: {
            name: 'users_email',
            msg: 'An account with this email already exists.'
        },
        validate: {
            isEmail: {
                msg: 'The email provided is not valid.'
            }
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare password: string;

    @HasMany(() => Session)
    declare sessions: Session[];

    @HasMany(() => Post)
    declare posts: Post[]

    @BeforeUpdate
    @BeforeCreate
    static async preSave(instance: User) {
        if (instance.changed('password')) {
            const saltWorkFactor: number = config.get('saltWorkFactor');
            const salt = await bcrypt.genSalt(saltWorkFactor);

            instance.password = await bcrypt.hash(instance.password, salt);
        }

        if (instance.changed('email'))
            instance.email = instance.email
                .toLowerCase().replace(/\s/g, "");
        
        if (instance.changed('username'))
            instance.username = instance.username
                .toLowerCase().replace(/\s/g, "");
    }

    async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    toJSON() {
        const { 
            password, ...values 
        } = this.get();

        return values;
    }
}

export default User;