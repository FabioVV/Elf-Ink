export const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if(parts.length == 2) return parts.pop().split(';').shift()
}

export const saveTheme = () => {
    const isDarkTheme = document.documentElement.classList.contains('dark-theme')
    document.cookie = `theme=${isDarkTheme ? 'dark' : 'light'}; path=/; max-age=31536000`
}

export const changeTheme = () => {
    document.documentElement.classList.toggle('dark-theme')
    saveTheme()
}

export const applyTheme = () => {
    const theme = getCookie('theme')
    if(theme == 'dark'){
        document.documentElement.classList.add('dark-theme')
    } else {
        document.documentElement.classList.remove('dark-theme')
    }
}

