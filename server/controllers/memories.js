import Memory from '../models/Memory.js';

export const getMemoriesWithImages = async (req, res) => {
  try {
    const memories = await Memory.getAllWithImages();
    
    // Convert BLOB to base64
    const formattedMemories = memories.map(memory => ({
      ...memory,
      image_data: memory.image_data?.toString('base64') || null
    }));

    res.json(formattedMemories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch memories", error });
  }
};