package com.apurva.gatewayservicev1;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
	
	@Autowired
	private MyUserDetailsService myUserDetailsService;
	
	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		Cookie authCookie = new Cookie("authCookie", "");
		
		if(request.getCookies() != null) {
			Cookie[] cookies = request.getCookies();
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("authCookie")) {
					authCookie.setValue(cookie.getValue());
				}
			}
		}
		
			
		request.setAttribute("Authorization", "Bearer " + authCookie.getValue());
		
		String authorizationHeaderString = (String) request.getAttribute("Authorization");
		
		String usernameString = null;
		String jwtString = null;
		
		if(authorizationHeaderString != null && authorizationHeaderString.startsWith("Bearer ") && authorizationHeaderString.length() > 10) {
			jwtString = authorizationHeaderString.substring(7);
			usernameString = jwtUtil.extractUsername(jwtString);
		}
		
		if(usernameString != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = this.myUserDetailsService.loadUserByUsername(usernameString);
			
			if(jwtUtil.validateToken(jwtString, userDetails)) {
				UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				
				usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			}
		}
		filterChain.doFilter(request, response);
		
	}
	
	
}
