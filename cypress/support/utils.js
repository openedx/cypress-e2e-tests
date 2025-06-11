// eslint-disable-next-line no-bitwise
const randomString = (length) => [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('')
export default randomString
