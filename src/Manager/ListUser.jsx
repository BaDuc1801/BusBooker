import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Modal, Input, notification, Button } from 'antd';
import { RiEditFill } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa';

const ListUser = () => {
  const beUrl = import.meta.env.VITE_APP_BE_URL;
  const [listUser, setListUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // To store the user being edited
  const [confirmDelete, setConfirmDelete] = useState(false); // To control delete modal visibility
  const [userIdToDelete, setUserIdToDelete] = useState(null); // To store the userId for deletion
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // To control edit modal visibility

  const [userForm, setUserForm] = useState({
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
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Chỉnh sửa',
      dataIndex: '',
      key: '',
      render: (_text, record) => (
        <div className="flex cursor-pointer text-xl gap-5">
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

  // Handle edit functionality
  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      avatar: user.avatar,
    });
    setIsEditModalVisible(true);
  };

  // Handle delete functionality
  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`${beUrl}/users/${userIdToDelete}`);
      setListUser(listUser.filter((user) => user._id !== userIdToDelete)); // Remove user from the UI
      setConfirmDelete(false); // Close the modal
      notification.success({ message: 'User deleted successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to delete user' });
      console.error('Error deleting user:', error);
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
      notification.success({ message: 'User updated successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to update user' });
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center">
      <Table
        dataSource={listUser}
        columns={columns}
        className="w-full"
        pagination={{ pageSize: 6 }}
      />

      {/* Edit Modal */}
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

      {/* Delete Confirmation Modal */}
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
