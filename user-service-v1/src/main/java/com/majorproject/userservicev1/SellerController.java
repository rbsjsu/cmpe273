package com.majorproject.userservicev1;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SellerController {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private SellerRepository sellerRepository;
	
	public String getJwtToken(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		for(Cookie cookie: cookies) {
			if(cookie.getName().equals("authCookie")) {
				return cookie.getValue();
			}
		}
		
		return "";
	}
	
	@GetMapping("/get-seller-company")
	public Seller getCompanyName(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		return sellerRepository.findByUserUserIdInteger(userIdInteger);
	}
}
