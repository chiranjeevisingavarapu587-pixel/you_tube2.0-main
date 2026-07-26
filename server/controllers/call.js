import { v4 as uuidv4 } from "uuid";
const rooms = {};
export const createRoom = (req, res) => {
  const roomId = uuidv4();
  rooms[roomId] = {
    participants: [],
    createdAt: new Date(),
  };
  res.status(200).json({
    success: true,
    roomId,
  });
};
export const joinRoom = (req, res) => {
  const { roomId, userId } = req.body;
  if (!rooms[roomId]) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }
  if (!rooms[roomId].participants.includes(userId)) {
    rooms[roomId].participants.push(userId);
  }
  res.status(200).json({
    success: true,
    participants: rooms[roomId].participants,
  });
};