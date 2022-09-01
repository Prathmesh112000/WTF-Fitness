# WTF-Fitness
Command To run Server: **npm run dev** </br>
default port:**8080** </br>
api link: **http://localhost:8080/route_name** </br>
deploy link: **https://wtf-backend-assignment.herokuapp.com** </br>
**/signup**: </br>
       **Method**: **POST**, </br>
        **Body**: **first_name,last_name,mobile,email,password,role** </br>
        **description**: It checks if the credentials are valid or not If it is valid it will store the credentials in database



**/login**: </br>
       **Method**: **POST**, </br>
        **Body**: **email,password,role** </br>
        **description**: It checks if the credentials are valid or not If it is valid it will return the token.

**/userdetails** </br>
       **Method**: **GET**, </br>
        **Header**:  **Authorization: Bearer token** </br>
        **description**: It will verify the token and based on the token header it will return the user.


**/getdata** </br>
       **Method**: **GET**, </br>
        **Query**:  **key value pair** </br>
        **description**: with query params it will return the specific user details.
