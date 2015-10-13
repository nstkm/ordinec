<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once "vendor/autoload.php";
require_once "lib/AuthManager.php";
use Symfony\Component\ClassLoader\UniversalClassLoader;
use Lib\AuthManager;

$loader = new UniversalClassLoader();

$loader->useIncludePath(true);

$loader->register();

$method = isset($_GET['method'])?$_GET['method']:'';

$responce = [
	'success' => false
];

switch ($method) {
	case 'getAccessToken':

			if(isset($_POST['login']) || isset($_POST['password'])){

				try{ 

					$authManager = new AuthManager;

					$data = $authManager->getAccessToken($_POST['login'], $_POST['password']);

					if(isset($data['access_token']) && isset($data['refresh_token'])){
					

						$dbh = new \PDO("pgsql:host=localhost;port=5432;dbname=ord_client", 'filippf', 'samosval'); 

						if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
						    $ip = $_SERVER['HTTP_CLIENT_IP'];
						} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
						    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
						} else {
						    $ip = $_SERVER['REMOTE_ADDR'];
						}

						$intIp = ip2long($ip);
					

						$lifetime = time() + $data['expires_in'];

						$sth = $dbh->prepare('
							DELETE FROM tbl_user_token WHERE access_token = :access_token AND ip =:ip
						');
						$sth->bindParam(':access_token', $data['access_token'], PDO::PARAM_STR);
						$sth->bindParam(':ip', $intIp, PDO::PARAM_INT);
						$sth->execute();

						$sth = $dbh->prepare('
							INSERT INTO 
								tbl_user_token 
								(access_token, ip, refresh_token, lifetime) 
							VALUES
								(:access_token, :ip, :refresh_token, :lifetime)
						');
						$sth->bindParam(':lifetime', $lifetime, PDO::PARAM_INT);
						$sth->bindParam(':refresh_token', $data['refresh_token'], PDO::PARAM_STR);
						$sth->bindParam(':access_token', $data['access_token'], PDO::PARAM_STR);
						$sth->bindParam(':ip', $intIp, PDO::PARAM_INT);
						
						if($sth->execute()){

							$responce['success'] = true;
							
							setcookie("token", $data['access_token'], $lifetime+86400, '/');

							$responce['access_token'] = $data['access_token'];
						}
					}
				}
				catch(Exception $e){

					//echo $e->getMessage();
				}
			}

		break;

	case 'refreshToken':

			if(isset($_POST['access_token'])){

				try{

					if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
					 	$ip = $_SERVER['HTTP_CLIENT_IP'];
					} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
					    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
					} else {
					    $ip = $_SERVER['REMOTE_ADDR'];
					}

					$intIp = ip2long($ip);

					$dbh = new \PDO("pgsql:host=localhost;port=5432;dbname=ord_client", 'filippf', 'samosval'); 

					$sth = $dbh->prepare("SELECT refresh_token FROM tbl_user_token WHERE ip=:ip AND access_token=:access_token LIMIT 1"); 
					$sth->bindParam(':access_token', $_POST['access_token'], PDO::PARAM_STR);
					$sth->bindParam(':ip', $intIp, PDO::PARAM_INT);

					if($sth->execute()){

						$row = $sth->fetch();

						if($row && isset($row['refresh_token'])){

							$authManager = new AuthManager;

							$data = $authManager->getAccessTokenByRefreshToken($row['refresh_token']);

							$lifetime = time() + $data['expires_in'];

							$sth = $dbh->prepare('
								UPDATE
									tbl_user_token 
								SET
									access_token =:access_token, lifetime =:lifetime WHERE access_token =:access_token_old
							');
							$sth->bindParam(':lifetime', $lifetime, PDO::PARAM_INT);
							$sth->bindParam(':access_token', $data['access_token'], PDO::PARAM_STR);
							$sth->bindParam(':access_token_old', $_POST['access_token'], PDO::PARAM_STR);

							if($sth->execute()){

								$responce['success'] = true;

								$responce['access_token'] = $data['access_token'];
								
								setcookie("token", $data['access_token'], $lifetime+86400, '/');
							}
						}
					}
				}
				catch(Exception $e){
					
				}
			}

		break;
		
		case 'checkToken':
		
			if(isset($_POST['access_token'])){
				
				if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
				 	$ip = $_SERVER['HTTP_CLIENT_IP'];
				} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
				    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
				} else {
				    $ip = $_SERVER['REMOTE_ADDR'];
				}

				$intIp = ip2long($ip);

				$dbh = new \PDO("pgsql:host=localhost;port=5432;dbname=ord_client", 'filippf', 'samosval'); 
			
				$sth = $dbh->prepare("SELECT refresh_token,lifetime FROM tbl_user_token WHERE ip=:ip AND access_token=:access_token LIMIT 1"); 
				$sth->bindParam(':access_token', $_POST['access_token'], PDO::PARAM_STR);
				$sth->bindParam(':ip', $intIp, PDO::PARAM_INT);

				if($sth->execute()){
				
					$row = $sth->fetch();
					
					if(isset($row['lifetime']) && $row['lifetime'] > time()){
					
						$responce['success'] = true;	
					}
				}	
			}
				
		break;
}

echo json_encode($responce);