import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Modal, Input, notification } from 'antd';
import { RiEditFill } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa';

const ListUser = () => {
  const beUrl = import.meta.env.VITE_APP_BE_URL;
  const [listUser, setListUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [userForm, setRouteForm] = useState({
    username: '',
    email: '',
    phoneNumber: '',
  });

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => {
        return <img src={text} alt="avatar" className="w-12 h-12 rounded-full" />;
      },
    },
    {
      title: 'Tên',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Chức vụ',
      dataIndex: '',
      key: 'role',
      render: (text) => {
        return (
          text.owner ? <p>{text.role} - {text.owner}</p> : <p>{text.role}</p>
        )
      }
    },
    {
      title: 'Chỉnh sửa',
      dataIndex: '',
      key: '',
      render: (_text, record) => (
        <div className="flex cursor-pointer text-lg gap-5">
          <p onClick={() => handleEdit(record)}>
            <RiEditFill />
          </p>
          <p
            className="text-red-500"
            onClick={() => handleDelete(record._id)}
          >
            <FaTrash />
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${beUrl}/users`);
        setListUser(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setRouteForm({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`${beUrl}/users/${userIdToDelete}`);
      setListUser(listUser.filter((user) => user._id !== userIdToDelete));
      setConfirmDelete(false);
      notification.success({ message: 'Xóa người dùng thành công' });
    } catch (error) {
      notification.error({ message: 'Lỗi khi xóa người dùng' });
    }
  };

  const cancelDeleteUser = () => {
    setConfirmDelete(false);
    setUserIdToDelete(null);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUser = await axios.put(
        `${beUrl}/users/userId/${selectedUser._id}`,
        userForm
      );
      setListUser(
        listUser.map((user) =>
          user._id === selectedUser._id ? updatedUser.data : user
        )
      );
      setIsEditModalVisible(false);
      notification.success({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
      notification.error({ message: 'Lỗi cập nhật người dùng' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRouteForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredUser = (user) => {
    return user.filter(user => {
      const { email, phoneNumber, username, role, owner } = user;
      return (
        email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  return (
    <div className="">
      <Input
        placeholder="Tìm kiếm "
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3"
      />
      <Table
        dataSource={filteredUser(listUser)}
        columns={columns}
        className="w-full"
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditModalVisible}
        onOk={handleSaveChanges}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div>
          <div className="mb-3">
            <label htmlFor="username">Tên:</label>
            <Input
              id="username"
              name="username"
              value={userForm.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <Input
              id="email"
              name="email"
              value={userForm.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber">Số điện thoại:</label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={userForm.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Xác nhận xóa người dùng"
        open={confirmDelete}
        onOk={confirmDeleteUser}
        onCancel={cancelDeleteUser}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
      </Modal>
    </div>
  );
};

export default ListUser;
