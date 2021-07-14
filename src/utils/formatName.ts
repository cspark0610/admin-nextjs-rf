const formatName = (members) => {
    if(members.length < 2){
        return `${members[0].lastName} ${members[0].firstName}`
    }
    if(members[0].lastName == members[1].lastName){
        return `${members[0].lastName} (${members[0].firstName}, ${members[1].firstName})`
    }
    return `${members[0].lastName} ${members[0].firstName}, ${members[1].lastName} ${members[1].firstName}`
}

export default formatName