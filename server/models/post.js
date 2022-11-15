import moongose from 'mongoose';
const { ObjectId } = moongose.Schema;

const postSchema = new moongose.Schema({
    content: {
        type: {},
        required: true,
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
    image: {
        url: String,
        public_id: String,
    },
    likes: [{ type: ObjectId, ref: "user" }],
    comments: [{
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: {
            type: ObjectId,
            ref: "User",
        },
    },],
}, { timestamps: true }
);

export default moongose.model("Post", postSchema);



