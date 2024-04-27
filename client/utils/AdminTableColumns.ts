import type { TableColumnsType } from 'ant-design-vue';

export const AdminTableColumns: TableColumnsType = [
    {
        title: 'ID',
        width: 250,
        dataIndex: 'id',
    },
    {
        title: 'Google ID',
        width: 250,
        dataIndex: 'googleId',
    },
    {
        title: 'Firstname',
        width: 150,
        dataIndex: 'firstName',
    },
    {
        title: 'Middlename',
        dataIndex: 'middleName',
        width: 150,
    },
    {
        title: 'Lastname',
        dataIndex: 'lastName',
        width: 150,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 250,
    },
    {
        title: 'Username',
        dataIndex: 'username',
        width: 150,
    },
    {
        title: 'Role',
        dataIndex: 'role',
        width: 100,
        filters: [
            {
                text: 'Admin',
                value: 'admin',
            },
            {
                text: 'User',
                value: 'user',
            },
        ],
        onFilter: (value, record) => record.role.startsWith(value),
    },
    {
        title: 'Title',
        dataIndex: 'title',
        width: 180,
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        width: 150,
    },
    {
        title: 'Country',
        dataIndex: 'country',
        width: 150,
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        width: 230,
        sorter: (a: UserInfo, b: UserInfo) => {
            const dateA = new Date(a.createdAt || '').getTime();
            const dateB = new Date(b.createdAt || '').getTime();
            
            return dateA - dateB;
        },
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        width: 230,
        sorter: (a: UserInfo, b: UserInfo) => {
            const dateA = new Date(a.createdAt || '').getTime();
            const dateB = new Date(b.createdAt || '').getTime();
            
            return dateA - dateB;
        },
    },
    {
        title: 'Update Password',
        dataIndex: 'password',
        width: 230,
    },
    {
        title: 'Action',
        dataIndex: 'action',
        fixed: 'right',
        width: 150,
    },
];
