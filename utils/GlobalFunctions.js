
 const getHash = (password) => {
    let hash = 0n;
    for (let i = 0; i < password?.length; i++) {
      const charCode = BigInt(password?.charCodeAt(i));
      hash = hash * 31n + charCode;
      hash = hash & 0xffffffffffffffffn;
    }
    const hashString = hash.toString(16).padStart(16, "0");
    return hashString;
  };

 const getHashVerify = (password, oldHash) => {
    let hash = 0n;
    for (let i = 0; i < password?.length; i++) {
      const charCode = BigInt(password?.charCodeAt(i));
      hash = hash * 31n + charCode;
      hash = hash & 0xffffffffffffffffn;
    }
    const hashString = hash.toString(16).padStart(16, "0");
    if (hashString === oldHash){
        return true
    }
    return false;
  };

const getUsersByQuery = async (req, res) => {
  const keyWord = req.query.search;

  try {
    let users;

    if (keyWord) {
      users = await UserModel.find({
        $and: [
          {
            $or: [
              { username: { $regex: keyWord, $options: 'i' } },
              { email: { $regex: keyWord, $options: 'i' } },
            ],
          },
          { _id: { $ne: req.user.id } },
        ],
      });
      res.status(200).json({ users });
    } else {
      users = {};
      res.status(400).json({ users, message: 'No keyword provided' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 const content = 
    `<html><head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Poppins&amp;display=swap" rel="stylesheet">
    
</head><body><div style="max-width: 400px;font-family: 'Poppins', sans-serif;
    background-color: #fff; padding: 32px 24px; font-size: 14px; color: #212121; display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; border-radius: 10px; box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);">
  <div style="text-align: center; font-weight: 600; font-size: 18px;">
    Verify Email
  </div>

  <form style="display: flex; flex-direction: column;">
    <!-- Inline styles for form elements like inputs would go here if they were included in the HTML -->
    <button type="submit" style="display: flex; justify-content: center; align-items: center; font-family: inherit; color: #fff; background-color: #212121; border: none; width: 100%; padding: 12px 16px; font-size: 14px; gap: 8px; margin: 12px 0; cursor: pointer; border-radius: 6px; box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);">
      Send Email
    </button>
  </form>

  <p style="align-self: center; font-weight: 500;">
    Don't want to verify your account?
    <a href="#" style="color: #1778f2; text-decoration: none; font-weight: 400;"> cancel</a>
  </p>
</div>
</body></html>
    `
  module.exports ={
    getHash,
    getHashVerify,
   getUsersByQuery,
   content
  }

 



 
