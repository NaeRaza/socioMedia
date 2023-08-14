const Post = require("../models/Post")
const User = require("../models/User")

//Create
const createPost = async (req, res) => {
    try {
        const image = req.file;
        const { description } = req.body; // Assurez-vous que userId est fourni dans le corps de la requête
        const userId = req.user.id;

        // Vérifiez si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const newPost = new Post({
            userId: user._id, // Utilisez l'ID de l'utilisateur trouvé
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: image ? image.path : null,
            likes: {},
            comments: []
        });

        await newPost.save();

        const posts = await Post.find();

        res.status(201).json(posts);

    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

//Read
const getFeedPosts = async(req, res)=>{
    try{
        const post = await Post.find();
        res.status(201).json(post)

    }catch(err){
        res.status(404).json({message: err.message})
    }
}

const getUserPosts = async(req, res)=>{
    try{
        const { userId} = req.params
        const post = await Post.find({ userId})
        res.status(200).json(post)

    }catch(err){
        res.status(404).json({message: err.message})
    }
}

//Update
const likePost = async (req, res) => {
    try{
        
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId)

        if(isLiked){
            post.likes.delete(userId)
        } else{
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new : true }
        );

        res.status(201).json(updatedPost)


    }catch(err){
        res.status(404).json({message: err.message})
    }
}

module.exports = {
    createPost,
    getFeedPosts,
    getUserPosts,
    likePost
}