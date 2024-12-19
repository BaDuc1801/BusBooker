import { Button, Carousel, Modal, Timeline } from 'antd'
import React, { useContext, useState } from 'react'
import { FaCircleDot, FaLocationDot } from 'react-icons/fa6'
import { PiArmchairFill } from 'react-icons/pi'
import { TbArmchair2, TbArmchair2Off } from 'react-icons/tb'
import SeatMap from './SeatMap'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import ReviewCard from './ReviewCard'

const ScheduleCard = ({ item, setText, endTime }) => {
  const formattedDate = date => {
    const getDate = new Date(date)
    return getDate.toLocaleDateString('vi-VN')
  }

  const formattedTime = (date) => {
    const getDate = new Date(date);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' };
    const rs = getDate.toLocaleTimeString('vi-VN', options);
    return rs
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [visible, setVisiblee] = useState(false)
  const [more, setMore] = useState(false)
  const [rv, setRv] = useState(false)

  const toggleModal = () => {
    setVisiblee(prevVisible => !prevVisible)
  }

  const onClickButton = () => {
    setMore(pre => !pre)
  }

  const onClickReview = () => {
    setRv(pre => !pre)
  }

  const handleImageClick = index => {
    setSelectedImageIndex(index)
  }

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prevSelectedSeats => {
      const updatedSeats = prevSelectedSeats.includes(seatNumber)
        ? prevSelectedSeats.filter(seat => seat !== seatNumber)
        : [...prevSelectedSeats, seatNumber];

      return updatedSeats.sort((a, b) => {
        const numA = parseInt(a.slice(1), 10);
        const numB = parseInt(b.slice(1), 10);
        return numA - numB;
      });
    });
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatNumber) => {
      const seat = item?.seats.find(seat => seat.seatNumber === seatNumber);
      return seat ? total + seat.price : total;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const [warning, setWarning] = useState(false)
  const nav = useNavigate()
  const { user } = useContext(UserContext);
  const [login, setLogin] = useState(false);
  const onLogin = () => {
    setLogin(pre => !pre);
  }
  const onClickNext = () => {
    if (user === null) {
      setLogin(true);
      return
    }
    if (selectedSeats.length === 0) {
      setWarning(pre => !pre);
      return;
    }
    let clickCount = parseInt(localStorage.getItem('clickCount'), 10) || 0;
    clickCount += 1;
    localStorage.setItem('clickCount', clickCount);
    if (endTime === "null") {
      localStorage.setItem('chieuDi', JSON.stringify({ scheduleId: item._id, startTime: item.startTime, busId: item.busId._id, licensePlate: item.busId.licensePlate, totalSeats: item.busId.totalSeats, seatNumber: selectedSeats }));
      localStorage.setItem('giaChieuDi', totalPrice)
      nav("/payment");
    } else {
      const originChoice = localStorage.getItem("originChoice");
      const destiChoice = localStorage.getItem("destiChoice");

      if (originChoice && destiChoice) {
        localStorage.setItem("originChoice", destiChoice);
        localStorage.setItem("destiChoice", originChoice);
      }

      localStorage.setItem("startTime", endTime);
      setMore(pre => !pre);
      setText("Chiều về");
      setSelectedSeats([]);
      if (clickCount === 1) {
        localStorage.setItem('chieuDi', JSON.stringify({ scheduleId: item._id, startTime: item.startTime, busId: item.busId._id, licensePlate: item.busId.licensePlate, totalSeats: item.busId.totalSeats, seatNumber: selectedSeats }));
        localStorage.setItem('giaChieuDi', totalPrice)
        nav("/route-details");
      }
      if (clickCount === 2) {
        localStorage.setItem('chieuVe', JSON.stringify({ scheduleId: item._id, startTime: item.startTime, busId: item.busId._id, licensePlate: item.busId.licensePlate, totalSeats: item.busId.totalSeats, seatNumber: selectedSeats }));
        localStorage.setItem('giaChieuVe', totalPrice)
        nav('/payment');
        return
      }
    }
  };

  return (
    <div className='bg-white rounded-md shadow-md px-3'>
      <div className='flex gap-5 pt-3'>
        <img
          src={item?.busId?.img[3]}
          className='w-40 h-40'
          onClick={toggleModal}
        ></img>
        <div className='font-semibold'>
          <p className='text-lg'>{item?.busId?.owner}</p>
          <p className='text-gray-600'>
            Limousine {item?.busId?.totalSeats} chỗ{' '}
          </p>
          <p className='text-gray-600 my-2'>{formattedDate(item?.startTime)}</p>
          <Timeline
            items={[
              {
                children: (
                  <p className='text-lg'>{formattedTime(item?.startTime)}</p>
                ),
                dot: <FaCircleDot className='text-md mt-1' />
              },
              {
                children: (
                  <p className='text-lg'>{formattedTime(item?.endTime)}</p>
                ),
                dot: <FaLocationDot className='text-lg mt-1' />
              }
            ]}
          />
        </div>
        <div className='flex justify-between flex-col mb-12 items-end'>
          <p className='text-[#1677ff] font-bold text-xl'>
            Từ {item?.seats[0]?.price.toLocaleString()}đ
          </p>
          <div className='flex flex-col items-end gap-2'>
            <p className='font-semibold text-gray-600'>
              Còn {item?.availableSeats} chỗ trống
            </p>
            <div className='flex gap-4 items-center'>
              <p className='text-[#1677ff] cursor-pointer underline' onClick={onClickReview}>
                Xem đánh giá
              </p>
              <button
                className={`font-semibold p-2 rounded-md text-md w-[115px] ${!more
                  ? 'bg-yellow-400 hover:bg-yellow-300'
                  : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                onClick={onClickButton}
              >
                {!more ? 'Chọn chuyến' : 'Hủy'}
              </button>
            </div>
          </div>
        </div>
        <Modal open={visible} onCancel={toggleModal} footer={null}>
          <div className='h-[320px]'>
            <img
              src={item?.busId?.img[selectedImageIndex]}
              className='w-full h-full'
            />
          </div>
          <Carousel
            dots={false}
            arrows
            infinite={false}
            slidesToShow={3}
            slidesToScroll={1}
          >
            {item?.busId?.img.map((image, index) => (
              <div
                className='h-36 p-2 mt-2 '
                onClick={() => handleImageClick(index)}
              >
                <img
                  className={`w-full h-full ${selectedImageIndex === index
                    ? 'border-4 border-blue-500'
                    : ''
                    }`}
                  key={index}
                  src={image}
                />
              </div>
            ))}
          </Carousel>
        </Modal>
      </div>
      {more && (
        <>
          <div className='border-t-2 flex items-center justify-between'>
            <div className='flex flex-col gap-3 pb-5 px-5 pt-2'>
              <p>Chú thích</p>
              <div className='flex items-center gap-3'>
                <TbArmchair2Off className='text-3xl text-gray-600' /> Ghế không bán
              </div>
              <div className='flex items-center gap-3'>
                <PiArmchairFill className='text-3xl text-green-500' /> Đang chọn
              </div>
              <div className='flex items-center gap-3'>
                <TbArmchair2 className='text-3xl text-green-400' />
                <div>
                  <p>Ghế đầu</p>{' '}
                  <p className='font-semibold'>{item?.seats[0]?.price}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <TbArmchair2 className='text-3xl text-orange-400' />
                <div>
                  <p>Ghế giữa</p>{' '}
                  <p className='font-semibold'>{item?.seats[4]?.price}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <TbArmchair2 className='text-3xl text-purple-400' />
                <div>
                  <p>Ghế cuối</p>{' '}
                  <p className='font-semibold'>
                    {item?.seats[item?.seats.length - 1]?.price}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <SeatMap seats={item?.seats} handleSeatClick={handleSeatClick} />
            </div>
          </div>
          <div className='border-t-2 flex items-center justify-between py-5'>
            <p>Ghế: <span className='text-[#1677ff] font-bold'>{selectedSeats.join(', ')}</span></p>
            <div className='flex items-center gap-3'>
              <p>Tổng cộng: <span className='text-[#1677ff] font-bold'>{totalPrice.toLocaleString()}đ</span></p>
              <button className='bg-[#1677ff] text-white py-2 px-3 rounded-md hover:bg-blue-500' onClick={onClickNext}>Tiếp tục</button>
            </div>
            <Modal
              open={warning} onCancel={onClickNext} centered
              footer={
                <Button onClick={onClickNext} type="primary" className='w-full font-semibold bg-yellow-400 text-black hover:!bg-yellow-300 hover:!text-black'>
                  Đã hiểu
                </Button>
              }>
              <p className='font-bold text-lg text-center'>Vui lòng chọn ít nhất 1 chỗ ngồi</p>
            </Modal>
            <Modal
              open={login} onCancel={onLogin} centered
              footer={
              <>
                <Button onClick={onLogin}>
                  Hủy
                </Button>
                <Button onClick={() => nav("/login")} type="primary" className='font-semibold bg-yellow-400 text-black hover:!bg-yellow-300 hover:!text-black'>
                  Đăng nhập
                </Button>
              </>
              }>
              <p className='font-bold text-lg text-center'>Bạn cần đăng nhập để có thể đặt vé</p>
            </Modal>
          </div>
        </>
      )}
      {
        rv && <ReviewCard busId={item?.busId?._id}/>
      }
    </div>
  )
}

export default ScheduleCard
