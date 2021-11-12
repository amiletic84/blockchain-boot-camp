const errorString = "VM Exception while processing transaction: ";
async function tryCatch(promise, reason) {
  try {
      await promise;
      throw null;
  }
  catch (error) {
      assert(error, "Expected a VM exception but did not get one");
      assert(error.message.search(errorString + reason) >= 0, "Expected an error containing '" + errorString + reason + "' but got '" + error.message + "' instead");
  }
};
async function catchRevert(promise) { await tryCatch(promise, "revert"); }

module.exports = {
  tryCatch,
  catchRevert
}