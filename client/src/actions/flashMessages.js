export function addFlashMessage(message) {
  return {
    type: 'ADD_FLASH_MESSAGE',
    payload: message,
  };
}

export function deleteFlashMessage(id) {
  return {
    type: 'DELETE_FLASH_MESSAGE',
    payload: id,
  };
}
