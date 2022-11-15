import { SyncOutlined } from "@ant-design/icons"

const AuthForm = ({ name, username, password, email, secert, setName, setUsername, setPassword, setSecert, setEmail, handleSubmit, loading, page,about,setAbout ,ProfileUpdate }) => (
    <form onSubmit={handleSubmit} >

        {page !== "login" && (<div className="form-group p-2">
            <label className="text-muted">Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder="Enter name" />
        </div>)}

        {page !== "login" &&   (<div className="form-group p-2">
            <label className="text-muted">Username </label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" placeholder="Enter a unique username" />
        </div>)}

        <div className="form-group p-2">
            <label className="text-muted">Email addres</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" disabled={ProfileUpdate} className="form-control" placeholder="Enter Email" />
        </div>
        <div className="form-group p-2">
            <label className="text-muted">Pasword</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter password" />
        </div>
       {ProfileUpdate && <div className="form-group p-2">
            <label className="text-muted">About Yourself</label>
            <input value={about} onChange={(e) => setAbout(e.target.value)} type="text" className="form-control" placeholder="Say Something about yourself" />
        </div>}
        {page !== "login" && (
            <>
                <div className="form-group p-2">
                    <small>
                        <label className="text-muted ">Pick a Question</label>
                    </small>
                    <select className="form-control">
                        <option>What is your fav color?</option>
                        <option>What is your fav animal?</option>
                        <option>What is your fav bird?</option>
                    </select>

                    <small className="form-text text-muted ">
                        For reset of password
                    </small>
                </div>

                <div className="form-group p-2">
                    <input value={secert} onChange={(e) => setSecert(e.target.value)} type="text"
                        className="form-control"
                        placeholder="Write your answer  here" />
                </div>
            </>)}
        <div className="form-group p-2">
            <button disabled={ProfileUpdate ? loading: page === "login" ? !email || !password : !name || !username || !email || !password || !secert} className="btn btn-primary btn-block">
                {loading ? <SyncOutlined spin className="py-1" /> : page !== "login" ? "Submit" : "login"}  </button>
        </div>
    </form>
)

export default AuthForm;