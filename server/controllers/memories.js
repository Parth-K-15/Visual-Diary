import Memory from '../models/Memory.js';

export const createMemory = async (req, res) => {
  try {
    const { title, date, isPrivate } = req.body;
    const userId = req.user.user_id;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    console.log('Before Memory.create'); // Debug log
    const { memoryId, filenameSafeTitle } = await Memory.create({
      userId,
      title,
      memoryDate: date,
      isPrivate: isPrivate === 'true'
    });
    console.log('After Memory.create'); // Debug log

    console.log('Before savePreviewImage'); // Debug log
    await Memory.savePreviewImage(req.file, filenameSafeTitle);
    console.log('After savePreviewImage'); // Debug log

    res.status(201).json({
      message: 'Memory created successfully',
      memoryId,
      filenameSafeTitle
    });
  } catch (error) {
    console.error('Full error stack:', error.stack); // Enhanced error logging
    res.status(500).json({ 
      message: 'Failed to create memory',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getMemoriesWithImages = async (req, res) => {
  try {
    const memories = await Memory.getAllWithImages();
    res.json(memories.map(memory => ({
      ...memory,
      image_data: memory.image_data?.toString('base64') || null
    })));
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch memories",
      error: error.message
    });
  }
};