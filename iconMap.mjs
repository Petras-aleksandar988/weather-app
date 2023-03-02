export const iconMap = new Map()

maping([0,1], "sun")
maping([2], "cloud-sun")
maping([3], "cloud")
maping([45,48], "smog")
maping([51,53,55,56,57,61,63,65,66,67,80,81,82], "cloud-showers-heavy")
maping([71,73,75,77,85,86], "snowflake")
maping([95,96,99], "cloud-bolt")

function maping(values, icon) {
    values.forEach(value => {
        iconMap.set(value,icon)
    })
}