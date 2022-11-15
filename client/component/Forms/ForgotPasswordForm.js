import { SyncOutlined } from "@ant-design/icons"
;

const ForgetPasswordForm = ({  newPassword, email, secert, setNewPassword, setSecert, setEmail, handleSubmit, loading, page, }) => (
    <form onSubmit={handleSubmit} >


        <div className="form-group p-2">
            <label className="text-muted">Email addres</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="Enter Email" />
        </div>
        <div className="form-group p-2">
            <label className="text-muted">Pasword</label>
            <input value={newPassword} onChange={(e) =>setNewPassword(e.target.value)} type="password" className="form-control" placeholder="Enter Password" />
        </div>
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
                        For reset of   newPassword
                    </small>
                </div>

                <div className="form-group p-2">
                    <input value={secert} onChange={(e) => setSecert(e.target.value)} type="text"
                        className="form-control"
                        placeholder="Write your answer  here" />
                </div>
        <div className="form-group p-2">
            <button disabled={!email || !  newPassword  || !secert} className="btn btn-primary btn-block">
                {loading ? <SyncOutlined spin className="py-1" /> : page !== "login" ? "Submit" : "login"}  </button>
        </div>
    </form>
)

export default ForgetPasswordForm;