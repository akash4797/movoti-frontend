export async function isUser(token){
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        "http://localhost:4000/verify",
        requestOptions
      );
      if ((await response.status) !== 200) {
        return null
      }
      return await response.json()
}