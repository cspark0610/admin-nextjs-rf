const formatName = (members) => {
    if(members.length < 2){
        return `${members[0].lastName.trim()} ${members[0].firstName.trim()}`
    }
    if(members[0].lastName == members[1].lastName){
        return `${members[0].lastName.trim()} (${members[0].firstName.trim()}, ${members[1].firstName.trim()})`
    }
    return `${members[0].lastName.trim()} ${members[0].firstName.trim()}, ${members[1].lastName.trim()} ${members[1].firstName.trim()}`
}

export default formatName