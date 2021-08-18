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
    let result = new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
    });
    return result
}
export const formatDate = (date) => {
    let result = new Date(date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });
    return result
}
export const unformatDate = (string) => {
    if(string){
    const newArray = string.split('/')
    return `${newArray[2]}-${newArray[0]}-${newArray[1]}T13:24:00`
    }
}