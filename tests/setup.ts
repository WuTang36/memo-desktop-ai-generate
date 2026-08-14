import '@testing-library/jest-dom'

// jsdom 默认提供 localStorage，无需额外 mock
// 但需要在每个测试前清理
beforeEach(() => {
  localStorage.clear()
})
