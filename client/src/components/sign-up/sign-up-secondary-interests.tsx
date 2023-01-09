import React, {useContext, useState, useEffect} from 'react';
import {CheckedList} from "../shared/inputs/checked-list";
import {UserContext} from "../../context/user-context";
import DropdownTreeSelect, {TreeNode} from "react-dropdown-tree-select";
import {InputEmpty} from "../shared/inputs/input-empty";
import {useHistory} from "react-router-dom";
import {getSecondaryInterests} from "../../firebase/get";

type InterestsKey = 'sport' | 'science' | 'technology' | 'business' | 'art'

export function SignUpSecondaryInterests() {
    const userContext = useContext(UserContext);
    let [interests, setInterests] = useState<{ [key: string]: { base: string[], other: string[], his: string } }>({
        sport: {base: [], other: [], his: ""},
        science: {base: [], other: [], his: ""},
        technology: {base: [], other: [], his: ""},
        business: {base: [], other: [], his: ""},
        art: {base: [], other: [], his: ""}
    })
    const history = useHistory()
    const [loading, setLoading] = useState(true)

    const [defaultQuestions, setDefault] = useState<{ [key: string]: { [key: string]: any, other: TreeNode[] } }>({
        sport: {
            items: ["Футбол", "Хоккей", "Лыжи", "Плаванье", "Волейбол"],
            other: [],
            name: "Спорт"
        },
        science: {
            items: ["Биология", "Психология", "Астрономия", "Математика", "Физика"],
            other: [],
            name: "Наука"
        },
        technology: {
            items: ["Нанотехнологии", "Космотех", "IT сфера", "3d моделирование", "Робототехника"],
            other: [],
            name: "Технологии"
        },
        art: {
            items: ["Путешествия", "Коллекционирование", "Кулинария", "Рукоделие", "Соцсети и блоги"],
            other: [],
            name: "Творчество"
        },
        business: {
            items: ["Экономика", "Предпринимательство", "Политика", "Юрисдикция", "Благотворительность"],
            other: [],
            name: "Бизнес"
        }
    })

    useEffect(() => {
        if (!userContext) return
        checkAvailabilityMainInterests('Творчество') && getDefaultOther('art')
        checkAvailabilityMainInterests('Наука') && getDefaultOther('science')
        checkAvailabilityMainInterests('Спорт') && getDefaultOther('sport')
        checkAvailabilityMainInterests('Технологии') && getDefaultOther('technology')
        checkAvailabilityMainInterests('Бизнес') && getDefaultOther('business')

        setLoading(false)
    }, [])

    function getDefaultOther(key: InterestsKey) {
        getSecondaryInterests(key, (interests) => {
            defaultQuestions[key].other = interests
            setDefault({...defaultQuestions})
        })
    }

    const keyOfMainInterests: InterestsKey[] = ['sport', 'science', 'technology', 'business', 'art']

    function changeInterestCheck(value: string, checked: boolean, key: InterestsKey) {
        if (!checked)
            interests[key].base = interests[key].base.filter(item => item != value)
        else
            interests[key].base.push(value)
        setInterests({...interests})
    }

    function changeInterestOther(selected: TreeNode[], key: InterestsKey) {
        interests[key].other = selected.map(item => item.value)
        setInterests({...interests})
    }

    function changeInterestHis(value: string, key: InterestsKey) {
        interests[key].his = value
        setInterests({...interests})
    }

    function checkAvailabilityMainInterests(key: string) {
        if (!userContext) return;
        return Object.keys(userContext.user.mainInterests).includes(key)
    }

    function submitInterests() {
        if (!userContext) return;

        let newInterests: { [key: string]: { priority: number, activity: number } } = {}
        Object.keys(interests).map(key => {
            interests[key].base.forEach(item => {
                newInterests[item] = {priority: 1, activity: 0}
            })
            interests[key].other.forEach(item => {
                newInterests[item] = {priority: 1, activity: 0}
            })
            interests[key].his.trim().length > 0 && interests[key].his.split(", ").forEach(item => {
                newInterests[item] = {priority: 1, activity: 0}
            })
        })
        //TODO нормальное разбиение по строке, нужно написать шаблон для Свое

        userContext.user.interests = newInterests;
        userContext.setUser({...userContext.user})
        history.push("/sign-up/repetition-interests")
    }

    if (!userContext || loading) return null;
    return (
        <div className="sign_up_secondary_interests_page page">
            <p className="big-header">Давай знакомиться</p>
            <p className="background-text">
                Пройди небольшую анкету о своих интересах и найди новые знакомства!
            </p>
            {keyOfMainInterests.map((item, i) => {
                if (!checkAvailabilityMainInterests(defaultQuestions[item].name)) return null;
                return (
                    <div key={i} className="interest_block">
                        <p className="weight700">{defaultQuestions[item].name}</p>
                        <CheckedList items={defaultQuestions[item].items}
                                     checkedItems={interests[item].base}
                                     onChange={(value, checked) => changeInterestCheck(value, checked, item)}/>
                        <div className="item ai_c w100per other">
                            <label>Другое</label>
                            <DropdownTreeSelect
                                data={defaultQuestions[item].other}
                                mode="multiSelect"
                                texts={{
                                    placeholder: interests[item].other.length > 0
                                        ? 'Выбрано: ' + interests[item].other.length
                                        : "Выбрать"
                                }}
                                onChange={(_, selected) => changeInterestOther(selected, item)}
                                inlineSearchInput={true}
                                className="dropdown-tree-select"/>
                        </div>
                        <div className="item ai_c w100per his">
                            <label>Свое</label>
                            <InputEmpty value={interests[item].his}
                                        change={(_, value) => changeInterestHis(value, item)}
                                        placeholder={""}
                                        helpText={""}
                                        keyField={"his"}
                                        errorText={""}/>
                        </div>
                    </div>
                )
            })}
            <div onClick={submitInterests} className="big_yellow_btn jc_c ai_c">Продолжить</div>
        </div>
    )
}