function Toggle({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center space-x-3 mt-5">
      <label htmlFor="example9" className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" id="example9" className="peer sr-only" onClick={() => onClick()}/>
        <div className="h-8 w-14 rounded-full bg-green-300 after:absolute after:top-1 after:left-1 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-red-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:after:bg-gray-50"></div>
      </label>
    </div>
  )
}

export default Toggle;