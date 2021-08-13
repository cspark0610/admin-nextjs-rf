export const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
export const dateToDayAndMonth = (date) => {
    let result = new Date(date).toLocaleDateString("en-GB", {
        month: "2-digit",
        day: "2-digit",
    });
    return result
}
export const formatDate = (date) => {
    let result = new Date(date).toLocaleDateString("en-GB", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit"
    });
    return result
}
export const unformatDate = (string) => {
    if(string){
    const newArray = string.split('/')
    return new Date(Date.UTC(newArray[2], newArray[1], newArray[0]))
    }
}