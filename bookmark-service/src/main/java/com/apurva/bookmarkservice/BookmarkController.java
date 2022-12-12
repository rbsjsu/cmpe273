package com.apurva.bookmarkservice;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class BookmarkController {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private BookmarkRepository bookmarkRepository;
	
	public boolean canAccess(HttpServletRequest request, Integer userIdInteger) {
		String jwtString = request.getHeader("Authorization").substring(7);
		String emailString = jwtUtil.extractUsername(jwtString);
		Integer idInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		return idInteger.equals(userIdInteger);
	}
	
	public String getJwtToken(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		for(Cookie cookie: cookies) {
			if(cookie.getName().equals("authCookie")) {
				return cookie.getValue();
			}
		}
		
		return "";
	}
	
	@GetMapping("/bookmarks-size")
	public Integer getBookmarkSize(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Bookmark bookmark = bookmarkRepository.findByUserIdInteger(userIdInteger);
		if(bookmark == null) {
			return 0;
		}
		else {
			return bookmark.getProductIdSet().size();
		}
	}
	
	@GetMapping("/bookmarks")
	public List<Product> getProductsByUserId(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		List<Product> products = new ArrayList<>();
		Bookmark bookmark = bookmarkRepository.findByUserIdInteger(userIdInteger);
		if(bookmark == null) {
			bookmark = new Bookmark();
			bookmark.setUserIdInteger(userIdInteger);
			bookmark.setProductIdSet(new HashSet<String>());
			bookmarkRepository.save(bookmark);
		}
		else {
			for(String productId: bookmark.getProductIdSet()) {
				System.out.println("PRODUCT ID IN BOOKMARK:"+ productId);
				products.add(restTemplate.getForObject("http://inventoryservice/product/" + productId, Product.class));
			}
		}
		return products;
	}
	
	/**
	 * this method can be used to check if a particular product is bookmarked by the user or not
	 * @param request
	 * @param userIdInteger
	 * @param productId
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/bookmarks/{productId}")
	public boolean getProductById(HttpServletRequest request, @PathVariable String productId, HttpServletResponse response) throws Exception {
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Bookmark bookmark = bookmarkRepository.findByUserIdInteger(userIdInteger);
		if(bookmark == null) {
			bookmark = new Bookmark();
			bookmark.setUserIdInteger(userIdInteger);
			bookmark.setProductIdSet(new HashSet<String>());
			bookmarkRepository.save(bookmark);
			return false;
		}
		else {
			return bookmark.getProductIdSet().contains(productId);
		}
		
	}
	
	@GetMapping("/add-to-bookmarks/{productId}")
	public String addProductById(HttpServletRequest request, @PathVariable String productId, HttpServletResponse response) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Bookmark bookmark = bookmarkRepository.findByUserIdInteger(userIdInteger);
		if(bookmark == null) {
			bookmark = new Bookmark();
			bookmark.setUserIdInteger(userIdInteger);
			bookmark.setProductIdSet(new HashSet<String>());
		}
		
		bookmark.getProductIdSet().add(productId);
		bookmarkRepository.save(bookmark);
		
		response.sendRedirect("http://localhost:8081/api/user/my-wishlist");
		
		return "Product added to bookmarks!";
	}
	
	@GetMapping("/remove-from-bookmarks/{productId}")
	public String deleteProductById(HttpServletRequest request, @PathVariable String productId, HttpServletResponse response) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Bookmark bookmark = bookmarkRepository.findByUserIdInteger(userIdInteger);
		if(bookmark == null) {
			bookmark = new Bookmark();
			bookmark.setUserIdInteger(userIdInteger);
			bookmark.setProductIdSet(new HashSet<String>());
			bookmarkRepository.save(bookmark);
			return "Product not found bookmarks!";
		}
		else {
			bookmark.getProductIdSet().remove(productId);
			bookmarkRepository.save(bookmark);
		}
		
		response.sendRedirect("http://localhost:8081/api/user/my-wishlist");
		
		return "product removed from bookmarks!";
	}
}
