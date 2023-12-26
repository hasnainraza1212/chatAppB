
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

 
  module.exports ={
    getHash,
    getHashVerify,
   getUsersByQuery
  }

 



 
