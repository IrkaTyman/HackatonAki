import React, {useContext} from 'react';
import {UserContext} from "../../context/user-context";
import {Link} from "react-router-dom";

export function SignUpRepetitionInterests() {
    const userContext = useContext(UserContext);

    if (!userContext || !userContext.user) return null;
    return (
        <div className="sign_up_repetition_interests_page page">
            <p className="big-header">Еще немного</p>
            <p className="weight700">Твои интересы</p>

            <div className="interests ai_c">
                {Object.keys(userContext.user.mainInterests).map((item , i)=> (
                    <div key={i} className="interest_container">
                        {item}
                    </div>
                ))}
                {Object.keys(userContext.user.interests).map((item, i) => (
                    <div key={i} className="interest_container">
                        {item}
                    </div>
                ))}
            </div>
            <Link to="/sign-up/chats" className="big_yellow_btn jc_c ai_c">Продолжить</Link>
        </div>
    )
}