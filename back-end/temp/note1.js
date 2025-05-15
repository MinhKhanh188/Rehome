  // Testing image upload function
  async uploadImage(req, res) {
    try {
      console.log('req.file:', req.file); // ✅ Check if file is received

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'rehome-test',
      });

      fs.unlinkSync(req.file.path); // clean up temp file

      res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Image upload failed 💔', details: error.message });
    }
  }

  // Testing multiple image upload function
  async uploadImages(req, res) {
    try {
      const uploadedUrls = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'rehome-test',
        });
        uploadedUrls.push(result.secure_url);
        fs.unlinkSync(file.path); // clean temp file
      }

      res.status(200).json({ imageUrls: uploadedUrls });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Multiple image upload failed 💔', details: error.message });
    }
  }