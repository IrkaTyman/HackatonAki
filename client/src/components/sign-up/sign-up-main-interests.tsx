import React, {useContext, useState, useEffect} from "react";
import {UserContext} from "../../context/user-context";
import DropdownTreeSelect from 'react-dropdown-tree-select'
import {User} from "../../types";
import {InputEmpty} from "../shared/input-empty";
import {CheckedList} from "../shared/checked-list";
import {useHistory} from "react-router-dom";

export function SignUpMainInterests() {
    const userContext = useContext(UserContext);
    const [user, setUser] = useState<User | null>(userContext && userContext.user)
    let [mainInterests, setMainInterests] = useState<string[]>([])
    let [error, setError] = useState({
        birth: false,
        location: false,
        mainInterests: false
    })
    const history = useHistory();


    useEffect(() => {
        change('dd')
    }, [])

    function change(pp: any) {
        if (!user) return
        user.location = "Екатеринбург"
        user.birth = new Date()
        setUser({...user})
    }

    function changeMainInterests(item: string, checked: boolean) {
        if (checked) mainInterests.push(item);
        else mainInterests = mainInterests.filter(interest => interest != item)
        setError({...error, mainInterests: mainInterests.length == 0})
        setMainInterests([...mainInterests]);
    }

    function submitMainInterests() {
        if (!user || !userContext) return;
        if (!user.birth || !user.location || mainInterests.length == 0) {
            setError({
                birth: !user.birth,
                location: !user.location,
                mainInterests: mainInterests.length == 0
            })
        } else {
            let newMainInterests:{[key:string]:{priority:number, activity:number}} = {}
            mainInterests.forEach((item,i) => {
                newMainInterests[item] = {
                    priority: i+1,
                    activity: 0
                }
            })

            userContext.user.mainInterests = newMainInterests;
            userContext.setUser({...userContext.user});
            history.push('/sign-up/secondary-interests')
        }
    }

    if (!user) return null
    return (
        <div className="sign-up-main-interests page">
            <p className="big-header">Давай знакомиться</p>
            <p className="background-text about_anketa">
                Пройди небольшую анкету о своих интересах и найди новые знакомства!
            </p>
            <DropdownTreeSelect data={[{label: "Екатеринбург", value: "Екатеринбург", checked:true}]}
                                mode="simpleSelect"
                                texts={{
                                    placeholder: "Екатеринбург"
                                }}
                                onChange={change}
                                inlineSearchInput={true}
                                className="dropdown-tree-select  simple-select only-line"/>
            <InputEmpty value={"01.02.2004"}
                        change={change}
                        placeholder={"Дата рождения"}
                        helpText={""}
                        keyField={"birth"}
                        errorText={""}/>
            <p className="weight700">1. Базовые интересы</p>
            <p className="background-text">Выбери из списка то, что тебе интересно</p>
            <CheckedList items={["Спорт", "Наука", "Бизнес", "Технологии", "Творчество"]}
                         checkedItems={mainInterests}
                         onChange={changeMainInterests}
            />
            {error.mainInterests && <p className="error-text">Выберите хотя бы один пункт</p>}
            <p className="background-text warning">
                В зависимости от базовых интересов будут задаваться вопросы по более узконаправленным темам.
            </p>
            <div onClick={submitMainInterests} className="big_yellow_btn jc_c ai_c">Продолжить</div>
        </div>
    )
}