<?php

namespace Lib;

class AuthManager
{

	/**
     * @var string $tokenUrl
     */
    private $tokenUrl = 'https://auth.ordinec.ru/oauth2/token';

    /**
     * @var integer $appId
     */
    private $appId = 'system';

    /**
     * @var string $secretKey
     */
    private $secretKey = 'testpass';


	/**
     * Получение токена по логину и паролю
     *
     * @param string $login
     * @param string $password
     *
     * @return array|null $tokenData
     */
    public function getAccessToken($login, $password)
    {
        $params = [
            'grant_type' => 'password',
            'client_secret' => $this->secretKey,
            'client_id' => $this->appId,
            'username' => $login,
            'password' => $password
        ];


		$client = new \GuzzleHttp\Client();
		$res = $client->request('POST', $this->tokenUrl,[
		    'form_params' => $params
		]);

		return json_decode($res->getBody()->getContents(), true);
    }

	/**
     * Получение токена по рефреш токену
     *
     * @param string $refToken
     *
     * @return array|null $tokenData
     */
    public function getAccessTokenByRefreshToken($refToken)
    {

    	$params = [
            'grant_type' => 'refresh_token',
            'client_secret' => $this->secretKey,
            'client_id' => $this->appId,
            'refresh_token' => $refToken
        ];

		$client = new \GuzzleHttp\Client();
		$res = $client->request('POST', $this->tokenUrl,[
		    'form_params' => $params
		]);

		return json_decode($res->getBody()->getContents(), true);
    }
}